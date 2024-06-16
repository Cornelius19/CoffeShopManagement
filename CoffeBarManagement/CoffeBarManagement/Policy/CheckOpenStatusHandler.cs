using CoffeBarManagement.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CoffeBarManagement.Policy
{
    public class CheckOpenStatusHandler : AuthorizationHandler<CheckOpenStatus>
    {
        private readonly ApplicationContext _applicationContext;

        public CheckOpenStatusHandler(ApplicationContext applicationContext, IHttpContextAccessor httpContextAccessor)
        {
            _applicationContext = applicationContext;
        }


        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, CheckOpenStatus requirement)
        {
            var status = await _applicationContext.Organizations.FindAsync(1);
            if (status == null || status.OpenStatus != requirement.Status) {
                context.Fail();    
                return; 
            }
            context.Succeed(requirement);

        }
    }
}
