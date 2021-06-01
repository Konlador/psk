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
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Identity.Web;

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
            services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
                    .AddMicrosoftIdentityWebApp(Configuration.GetSection("AzureAd"));

            services.AddControllersWithViews(options =>
                                                 {
                                                 var policy = new AuthorizationPolicyBuilder()
                                                              .RequireAuthenticatedUser()
                                                              .Build();
                                                 options.Filters.Add(new AuthorizeFilter(policy));
                                                 });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            
            services.AddDbContext<IDatabaseContext, DatabaseContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("PSKDB")));

            services.AddMvc(options =>
                options.ModelBinderProviders.Insert(0, new DriveScopeBinderProvider()));

            services.AddCors(options =>
                                 {
                                 options.AddPolicy("CorsApi",
                                     builder => builder
                                                .SetIsOriginAllowed(_ => true) //for all origins
                                                .AllowCredentials()
                                                .AllowAnyHeader()
                                                .AllowAnyMethod());
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
            app.UseDeveloperExceptionPage();

            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseApiKey();

            app.UseRouting();
            app.UseCors("CorsApi");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
            endpoints.MapControllers();
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
    }
