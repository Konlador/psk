using Azure.Storage.Blobs;
using Database;
using Domain;
using Domain.Drives;
using Domain.Impl;
using Domain.Impl.Upload;
using Domain.Upload;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc.Authorization;

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

            services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApp(Configuration.GetSection("AzureAd"));

            services.AddControllersWithViews(options =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                options.Filters.Add(new AuthorizeFilter(policy));
            });
           services.AddRazorPages()
                .AddMicrosoftIdentityUI();

            services.AddDbContext<IDatabaseContext, DatabaseContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("PSKDB")));

            services.AddMvc(options => {
                options.ModelBinderProviders.Insert(0, new DriveScopeBinderProvider());
                //options.Filters.Add("nurodyti filtra");
            });

            services.AddControllers();
            services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" }); });

            services.AddScoped<IGlobalScope, GlobalScope>();
            services.AddScoped<IDriveRepository, DriveRepository>();
            services.AddScoped<IUploadTransactionRepository, UploadTransactionRepository>();
            services.AddScoped<IUploadTransactionService, UploadTransactionService>();
            services.AddScoped(_ => new BlobContainerClient(Configuration.GetConnectionString("PSKStorageAccount"), "drives"));
            }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
            {
            if (env.IsDevelopment())
                {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
                }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
            }
        }
    }