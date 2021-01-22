using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using VueCliMiddleware;
using System;
using System.Text.Json;

public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration) => Configuration = configuration;

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSpaStaticFiles(x => x.RootPath = "dist");
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseStaticFiles();
        app.UseSpaStaticFiles();

        app.UseSpa(x =>
        {
            var apiUrl = Configuration.GetValue<string>("ApiUrl");
            if (env.IsEnvironment("VS"))
            {
                Environment.SetEnvironmentVariable("VUE_APP_ApiUrl", apiUrl);
                x.Options.SourcePath = "ClientApp";
                x.UseVueCli(npmScript: "serve");
            }
            else
            {
                string sourcePath = "dist";
                SetupVariables(new
                {
                    apiUrl = apiUrl
                }, sourcePath);
                x.Options.SourcePath = sourcePath;
            }
        });
    }

    public void SetupVariables(object settings, string sourcePath)
    {
        using (var stream = new StreamWriter($@"{Environment.CurrentDirectory}\{sourcePath}\env.json"))
        {
            stream.Write(JsonSerializer.Serialize(settings));
        };
    }
}