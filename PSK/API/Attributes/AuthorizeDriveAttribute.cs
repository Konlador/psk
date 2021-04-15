using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Domain;
using Domain.StorageItems;
using Domain.Upload;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
using API.Attributes;

namespace API.Attributes
{
    public class AuthorizeDriveAttribute: ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        { 
/*                var userEmail = filterContext.HttpContext.User.Identity.Name;
                string driveId = (string)filterContext.RouteData.Values["driveId"];

                if (userEmail != null && driveId != null)
                {
                    var hashedUserEmail = userEmail.GetHashCode(); //how to convert to guid
                    //create filter -> kai patrigerinamas controllerio endpointas, iskvieciamas filtras ("name")
                    //is papassinamas filterContext, 
                }
                else
                {
                    throw new UnauthorizedAccessException(
                        "Failed to authorize user with email: " + userEmail + " for drive with id: " + driveId
                        );
                }*/
        }
    }
}
