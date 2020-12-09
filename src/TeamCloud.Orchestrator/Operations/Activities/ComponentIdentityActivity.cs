﻿/**
 *  Copyright (c) Microsoft Corporation.
 *  Licensed under the MIT License.
 */

using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using TeamCloud.Azure.Deployment;
using TeamCloud.Azure.Resources;
using TeamCloud.Model.Data;
using TeamCloud.Orchestration;
using TeamCloud.Orchestrator.Templates.ResourceGroup;

namespace TeamCloud.Orchestrator.Operations.Activities
{
    public sealed class ComponentIdentityActivity
    {
        private readonly IAzureDeploymentService azureDeploymentService;

        public ComponentIdentityActivity(IAzureDeploymentService azureDeploymentService)
        {
            this.azureDeploymentService = azureDeploymentService ?? throw new System.ArgumentNullException(nameof(azureDeploymentService));
        }

        [FunctionName(nameof(ComponentIdentityActivity))]
        [RetryOptions(3)]
        public async Task<string> Run(
            [ActivityTrigger] IDurableActivityContext context)
        {
            if (context is null)
                throw new ArgumentNullException(nameof(context));

            var input = context.GetInput<Input>();

            var template = new ComponentIdentityTemplate();

            template.Parameters["deployementScopeId"] = input.DeploymentScope.Id;

            var projectResourceGroupId = AzureResourceIdentifier.Parse(input.Project.ResourceId);

            var deployment = await azureDeploymentService
                .DeployResourceGroupTemplateAsync(template, projectResourceGroupId.SubscriptionId, projectResourceGroupId.ResourceGroup)
                .ConfigureAwait(false);

            return deployment.ResourceId;
        }

        internal struct Input
        {
            public Project Project { get; set; }

            public DeploymentScope DeploymentScope { get; set; }
        }
    }
}