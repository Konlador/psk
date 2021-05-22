using Azure.Storage.Blobs;
using Database;
using Domain;
using Domain.Drives;
using Domain.Impl;
using Domain.Impl.Management;
using Domain.Impl.Upload;
using Domain.Management;
using Domain.Upload;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Azure.Storage.Queues;
using Azure.Core.Extensions;
using System;

namespace MediaDriveApp
    {
    public class Startup
        {
        public Startup(IConfiguration configuration)
            {
            Configuration = configuration;
            }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
            {
            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            
            services.AddDbContext<IDatabaseContext, DatabaseContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("PSKDB")));

            services.AddMvc(options =>
                options.ModelBinderProviders.Insert(0, new DriveScopeBinderProvider()));

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithOrigins("http://localhost:3000");
                });
            });

            services.AddControllers();
            services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new OpenApiInfo { Title = "MediaDrives", Version = "v1" }); });

            services.AddScoped<IGlobalScope, GlobalScope>();
            services.AddScoped<IDriveRepository, DriveRepository>();
            services.AddScoped<IUploadTransactionRepository, UploadTransactionRepository>();
            services.AddScoped<IUploadTransactionService, UploadTransactionService>();
            services.AddScoped<IManagementService, ManagementService>();
            services.AddScoped<BlobContainerClient>(_ => new BlobContainerClient(Configuration.GetConnectionString("PSKStorageAccount"), "drives"));
            services.AddAzureClients(builder =>
                {
                builder.AddBlobServiceClient(Configuration["ConnectionStrings:PSKStorageAccount:blob"]);
                });
            }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
            {
            // if (env.IsDevelopment())
            //     {
            app.UseDeveloperExceptionPage();
            //     }
            // else
            //     {
            //     app.UseExceptionHandler("/Error");
            //     // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            //     app.UseHsts();
            //     }

            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            // app.UseApiKey();
          

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    "default",
                    "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                    {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                    }
            });
            }
        }
    internal static class StartupExtensions
        {
        public static IAzureClientBuilder<BlobServiceClient, BlobClientOptions> AddBlobServiceClient(this AzureClientFactoryBuilder builder, string serviceUriOrConnectionString, bool preferMsi)
            {
            if (preferMsi && Uri.TryCreate(serviceUriOrConnectionString, UriKind.Absolute, out Uri serviceUri))
                {
                return builder.AddBlobServiceClient(serviceUri);
                }
            else
                {
                return builder.AddBlobServiceClient(serviceUriOrConnectionString);
                }
            }
        public static IAzureClientBuilder<QueueServiceClient, QueueClientOptions> AddQueueServiceClient(this AzureClientFactoryBuilder builder, string serviceUriOrConnectionString, bool preferMsi)
            {
            if (preferMsi && Uri.TryCreate(serviceUriOrConnectionString, UriKind.Absolute, out Uri serviceUri))
                {
                return builder.AddQueueServiceClient(serviceUri);
                }
            else
                {
                return builder.AddQueueServiceClient(serviceUriOrConnectionString);
                }
            }
        }
    }
