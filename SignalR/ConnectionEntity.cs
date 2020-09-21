using Microsoft.Azure.Cosmos.Table;
using System;
//using Microsoft.WindowsAzure.Storage.Table;

namespace SignalR
{
    public class ConnectionEntity : TableEntity
    {
        public ConnectionEntity() { }

        public ConnectionEntity(string userName, string connectionID)
        {
            this.PartitionKey = userName;
            this.RowKey = connectionID;
        }
    }
}
