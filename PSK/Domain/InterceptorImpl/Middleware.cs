using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.IO;
using System;

namespace Domain
{
    public class ApiKeyMiddleware
    {
        private readonly string log_path = "log.txt";

        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public ApiKeyMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<ApiKeyMiddleware>();
        }

        // logging HTTP calls both to console and to file
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            finally
            {
                string httpCallInfo = $"Request {context.Request?.Method} {context.Request?.Path.Value} => response status {context.Response?.StatusCode}";
                _logger.LogInformation(httpCallInfo);
                LogWrite(httpCallInfo);
            }
        }

        public void LogWrite(string logMessage)
        {
            try
            {
                using (StreamWriter w = File.AppendText(log_path))
                {
                    Log(logMessage, w);
                }
            }
            catch (Exception ex)
            {
            }
        }

        public void Log(string logMessage, TextWriter txtWriter)
        {
            try
            {
                txtWriter.Write("\r\nLog Entry : ");
                txtWriter.WriteLine("{0} {1}", DateTime.Now.ToLongTimeString(),
                    DateTime.Now.ToLongDateString());
                txtWriter.WriteLine("  :");
                txtWriter.WriteLine("  :{0}", logMessage);
                txtWriter.WriteLine("-------------------------------");
            }
            catch (Exception ex)
            {
            }
        }
    }
}
