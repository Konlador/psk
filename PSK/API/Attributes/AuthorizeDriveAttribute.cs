using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Attributes
{
    public class AuthorizeDriveAttribute: ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Session != null)
            {
                var user = filterContext.HttpContext.User;
                if (user != null)
                {
                    var hashedUserEmail = user.GetHashCode();
                }
                else
                {
                    throw new Exception($"Something went wrong authorizing action");
                }
            }
        }
    }
}
