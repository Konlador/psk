using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using System.Text;

namespace Domain
{
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public ApiKeyMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<ApiKeyMiddleware>();
        }

        public async Task Invoke(HttpContext context)
        {
            var requestLog = $"REQUEST HttpMethod: {context.Request.Method}, Path: {context.Request.Path}";

            _logger.LogInformation(requestLog);
 
            await _next.Invoke(context);

            _logger.LogInformation($"Finished call with status {context.Response.StatusCode}");
        }
    }
}
