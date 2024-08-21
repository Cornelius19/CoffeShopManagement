using Microsoft.AspNetCore.Authorization;

namespace CoffeBarManagement.Policy
{
    public class CheckOpenStatus: IAuthorizationRequirement
    {
        public bool Status { get; set; }

        public CheckOpenStatus(bool status)
        {
            Status = status;
        }
    }
}
