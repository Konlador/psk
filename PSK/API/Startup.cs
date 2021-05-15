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
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Azure;
using Azure.Core.Extensions;
using System;

namespace API
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
            services.AddDbContext<IDatabaseContext, DatabaseContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("PSKDB")));

            services.AddMvc(options =>
                options.ModelBinderProviders.Insert(0, new DriveScopeBinderProvider()));

            services.AddControllers();
            services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new OpenApiInfo { Title = "MediaDrives", Version = "v1" }); });

            services.AddScoped<IGlobalScope, GlobalScope>();
            services.AddScoped<IDriveRepository, DriveRepository>();
            services.AddScoped<IUploadTransactionRepository, UploadTransactionRepository>();
            services.AddScoped<IUploadTransactionService, UploadTransactionService>();
            services.AddScoped<IManagementService, ManagementService>();
            services.AddScoped(_ => new BlobContainerClient(Configuration.GetConnectionString("PSKStorageAccount"), "drives"));
            services.AddAzureClients(builder =>
                {
                builder.AddBlobServiceClient(Configuration["ConnectionStrings:PSKStorageAccount:blob"], true);
                });
            }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
            {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
            }
        }
    internal static class StartupExtensions
        {
        public static IAzureClientBuilder<BlobServiceClient, BlobClientOptions> AddBlobServiceClient(this AzureClientFactoryBuilder builder, string serviceUriOrConnectionString, bool preferMsi)
            {
            if (preferMsi && Uri.TryCreate(serviceUriOrConnectionString, UriKind.Absolute, out var serviceUri))
                return builder.AddBlobServiceClient(serviceUri);

            return builder.AddBlobServiceClient(serviceUriOrConnectionString);
            }
        }
    }