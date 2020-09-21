using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos.Table;
using System.Diagnostics;

namespace SignalR
{
    public class ChatHub : Hub
    {
        //private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();

        public async Task SendMessageAll(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task<string> Login(string user)
        {
            var connectionid = Context.ConnectionId;
            var table = GetConnectionTable2();
            await table.CreateIfNotExistsAsync();
            EmployeeEntity employeeEntity = new EmployeeEntity(user, connectionid);
            Microsoft.Azure.Cosmos.Table.TableOperation insertOperation = Microsoft.Azure.Cosmos.Table.TableOperation.InsertOrReplace(employeeEntity);
            table.Execute(insertOperation);
            return connectionid;
        }

        public async Task<string> GerUser(string user)
        {
            var connectionid = Context.ConnectionId;
            return connectionid;
        }

        public async Task LogoutByUser(string user, string connectionid)
        {
            var table = GetConnectionTable2();
            await table.CreateIfNotExistsAsync();
            EmployeeEntity employeeEntity = new EmployeeEntity(user, connectionid);

            Microsoft.Azure.Cosmos.Table.TableOperation Remove = Microsoft.Azure.Cosmos.Table.TableOperation.Delete(employeeEntity);
            table.Execute(Remove);
        }

        public async Task LogoutAllUser(string user)
        {
            var table = GetConnectionTable2();
            await table.CreateIfNotExistsAsync();
            Microsoft.Azure.Cosmos.Table.TableQuery<EmployeeEntity> query = new Microsoft.Azure.Cosmos.Table.TableQuery<EmployeeEntity>()
                   .Where(Microsoft.Azure.Cosmos.Table.TableQuery.GenerateFilterCondition("PartitionKey", Microsoft.Azure.Cosmos.Table.QueryComparisons.Equal, user));
            foreach (var item in table.ExecuteQuery(query))
            {
                var oper = Microsoft.Azure.Cosmos.Table.TableOperation.Delete(item);
                table.Execute(oper);
            }
            //Microsoft.Azure.Cosmos.Table.TableOperation Remove = Microsoft.Azure.Cosmos.Table.TableOperation.Delete(new EmployeeEntity() { PartitionKey = user });
            //await table.ExecuteAsync(Remove);
        }

        public async Task SendMessageToUser(string usersend, string userrecieve, string message)
        {
            //if (usersend != "")
            //{
            //    var table = GetConnectionTable2();
            //    table.ExecuteQuery
            //    var group = Clients.Group(userrecieve);
            //    await group.SendAsync("ReceiveMessage", usersend, message);
            //    Debug.WriteLine($"ReceiveMessageToUser, {usersend}, {message}");
            //}
            var table = GetConnectionTable2();
            IQueryable<EmployeeEntity> lists = table.CreateQuery<EmployeeEntity>()
                .Where(it => it.PartitionKey == userrecieve);

            foreach (var item in lists)
            {
                await Clients.Client(item.RowKey).SendAsync("ReceiveMessageToUser", usersend, message);
            }
        }


        private Microsoft.Azure.Cosmos.Table.CloudTable GetConnectionTable2()
        {
            var storageAccount =
                Microsoft.Azure.Cosmos.Table.CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=signalab;AccountKey=xbad3br/3o0AglWZ4iM1WdepVOlm9CSoMRmDbUlvFYmmUmJTlHF2hxqvsnC99fELsLvhQE1YzAi1x3mLOh9Yhg==;EndpointSuffix=core.windows.net");
            var tableClient = storageAccount.CreateCloudTableClient();
            return tableClient.GetTableReference("demotable2");
        }

        public List<string> GetEmployee(string name)
        {
            var table = GetConnectionTable2();
            var lists = new List<string>();
            if (name == "" || name == string.Empty)
            {
                var query = new Microsoft.Azure.Cosmos.Table.TableQuery<EmployeeEntity>();
                var lst = table.ExecuteQuery(query).ToList();
                foreach (var item in lst)
                {
                    lists.Add(item.PartitionKey);
                }
                return lists;
            }
            else
            {

                var condition = Microsoft.Azure.Cosmos.Table.TableQuery.GenerateFilterCondition("PartitionKey", Microsoft.Azure.Cosmos.Table.QueryComparisons.Equal, name);
                var query = new Microsoft.Azure.Cosmos.Table.TableQuery<EmployeeEntity>().Where(condition);

                var lst = table.ExecuteQuery(query).ToList();
                foreach (var item in lst)
                {
                    lists.Add(item.PartitionKey);
                }
                return lists;
            }
        }

        public async Task GetOnline()
        {
            //var Users = _connections.GetConnections(userrecieve);
            //foreach (var item in Users)
            //{
            //    await Clients.Client(item).SendAsync("ReceiveMessageToUser", usersend, message);
            //}
        }


        public override Task OnDisconnectedAsync(Exception exception)
        {
            //var c = Context.ConnectionId;
            return base.OnDisconnectedAsync(exception);
        }
    }
}
