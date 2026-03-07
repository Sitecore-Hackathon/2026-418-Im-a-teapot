using System.Collections.Concurrent;
using CoordinatorApi.Shared;

namespace CoordinatorApi.Receive;

public class InMemoryStorageClient : IStorageClient
{
    private static readonly ConcurrentDictionary<string, List<SitecoreWebHookModel>> _storage = new();
    private static readonly ConcurrentDictionary<string, List<string>> _rawData = new();

    public Task Add(string sitecoreInstanceId, SitecoreWebHookModel model, string? raw = null)
    {
        _storage.AddOrUpdate(
            sitecoreInstanceId,
            [model],
            (key, existingList) =>
            {
                var updatedList = new List<SitecoreWebHookModel>(existingList) { model };
                return updatedList;
            }
        );

        if (raw != null)
        {
            _rawData.AddOrUpdate(
                sitecoreInstanceId,
                [raw],
                (key, existingList) =>
                {
                    var updatedList = new List<string>(existingList) { raw };
                    return updatedList;
                }
            );
        }

        return Task.CompletedTask;
    }
}
