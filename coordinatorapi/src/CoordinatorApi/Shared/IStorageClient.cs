namespace CoordinatorApi.Shared;

public interface IStorageClient
{
    Task Add(string sitecoreInstanceId, SitecoreWebHookModel model, string? raw, CancellationToken cancellationToken);
}