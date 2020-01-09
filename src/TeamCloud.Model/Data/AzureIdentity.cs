/**
*  Copyright (c) Microsoft Corporation.
*  Licensed under the MIT License.
*/

using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace TeamCloud.Model
{
    [JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
    public class AzureIdentity : Identifiable, IEquatable<AzureIdentity>
    {
        public Guid Id { get; set; }

        public string AppId { get; set; }

        public string Secret { get; set; }

        public bool Equals(AzureIdentity other) => Id.Equals(other.Id);
    }
}