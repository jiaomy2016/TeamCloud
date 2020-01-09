﻿/**
 *  Copyright (c) Microsoft Corporation.
 *  Licensed under the MIT License.
 */

using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Reflection;
using TeamCloud.Configuration;
using TeamCloud.Data;
using TeamCloud.Data.CosmosDb;
using TeamCloud.Orchestrator;
using TeamCloud.Orchestrator.Services;

[assembly: FunctionsStartup(typeof(Startup))]

namespace TeamCloud.Orchestrator
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            if (builder is null)
                throw new ArgumentNullException(nameof(builder));

            builder.Services
                .AddOptions(Assembly.GetExecutingAssembly())
                .AddMvcCore()
                .AddNewtonsoftJson();

            builder.Services
                .AddScoped<IAzureSessionFactory, AzureSessionFactory>()
                .AddScoped<IProjectsRepository, CosmosDbProjectsRepository>()
                .AddScoped<ITeamCloudRepository, CosmosDbTeamCloudRepository>();
        }
    }
}