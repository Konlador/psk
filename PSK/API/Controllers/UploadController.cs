using Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
    {
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UploadController : ControllerBase
        {
        private readonly DatabaseContext m_dbContext;

        public UploadController(DatabaseContext dbContext)
            {
            m_dbContext = dbContext;
            }
        }
    }