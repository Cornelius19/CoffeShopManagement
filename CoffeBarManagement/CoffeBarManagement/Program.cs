using CoffeBarManagement;
using CoffeBarManagement.Data;
using CoffeBarManagement.Data.IdentityDbContext;
using CoffeBarManagement.Models.IdentityModels;
using CoffeBarManagement.Models.Models;
using CoffeBarManagement.Policy;
using CoffeBarManagement.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(name: JwtBearerDefaults.AuthenticationScheme, securityScheme:
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Description = "Enter the Bearer authorization : `Bearer Generated-JWT-Token`",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
        new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference
            {
                Type = ReferenceType.SecurityScheme,
                Id = JwtBearerDefaults.AuthenticationScheme
            }
        }, new string[]{ }
        }
    });
});



builder.Services.AddDbContext<Context>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddDbContext<ApplicationContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("ApplicationConnection"));
});

builder.Services.AddScoped<JWTService>();//for injecting our jwtService inside our controlers


//defining our identityCore Service
builder.Services.AddIdentityCore<User>(options =>
{
    options.SignIn.RequireConfirmedEmail = true;
})
    .AddRoles<IdentityRole>() //be able to add roles
    .AddRoleManager<RoleManager<IdentityRole>>()
    .AddEntityFrameworkStores<Context>()
    .AddSignInManager<SignInManager<User>>()
    .AddUserManager<UserManager<User>>(); //for creating Users


//to be able to authenticate users using JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            //for validating token based on our key
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])),
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidateIssuer = true,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization(options => {
    options.AddPolicy("CheckOpenStatus", policy => 
        policy.Requirements.Add(new CheckOpenStatus(true)));
});

builder.Services.AddScoped<IAuthorizationHandler, CheckOpenStatusHandler>();


builder.Services.AddCors();



var app = builder.Build();

app.UseCors(option =>
{
    option.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200", "http://192.168.0.70:4200");
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


//Create our roles in case they don't exist
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var roles = new[] { "Admin", "Employee", "Client","POS" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}

//Create admin account in case it doesn't exist
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();


    var adminCreating = new User
    {
        FirstName = "Corneliu".ToLower(),
        LastName = "Museteanu".ToLower(),
        UserName = "corneliu@gmail.com".ToLower(),
        Email = "corneliu@gmail.com".ToLower(),
        EmailConfirmed = true
    };

    var checkIfExist = await userManager.FindByEmailAsync(adminCreating.Email);
    if(checkIfExist == null)
    {
        await userManager.CreateAsync(adminCreating, "P@ssword1!");
        await userManager.AddToRoleAsync(adminCreating, Dependencis.ADMIN_ROLE);
    }

    var checkAnotherDb = await context.Employees.Where(q => q.UserId == checkIfExist.Id).FirstOrDefaultAsync();
    if(checkAnotherDb == null)
    {
        var admin = new Employee
        {
            FirstName = "Corneliu",
            LastName = "Museteanu",
            UserId = checkIfExist.Id,
            Email = checkIfExist.Email,
            Role = "admin",
            Lock = false,
            Salary = 1,
        };
        await context.AddAsync(admin);
        await context.SaveChangesAsync();
    }
}
using (var scope = app.Services.CreateScope())
{
    var context = new ApplicationContext();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();


    var posCreating = new User
    {
        FirstName = "Manager".ToLower(),
        LastName = "POS".ToLower(),
        UserName = "pos@gmail.com".ToLower(),
        Email = "pos@gmail.com".ToLower(),
        EmailConfirmed = true
    };

    var checkIfExist = await userManager.FindByEmailAsync(posCreating.Email);
    if (checkIfExist == null)
    {
        await userManager.CreateAsync(posCreating, "P@ssword1!");
        await userManager.AddToRoleAsync(posCreating, Dependencis.POS_ROLE);
    }
}
    

app.Run();
