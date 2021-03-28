using Database;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
    {
    [ApiController]
    [Route("[controller]")]
    public class UploadController : ControllerBase
        {
        private readonly DatabaseContext m_dbContext;

        public UploadController(DatabaseContext dbContext)
            {
            m_dbContext = dbContext;
            }
        }
    }