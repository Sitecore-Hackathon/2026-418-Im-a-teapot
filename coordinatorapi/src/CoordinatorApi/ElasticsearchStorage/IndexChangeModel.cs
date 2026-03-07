

namespace CoordinatorApi.ElasticsearchStorage;

public class IndexChangeModel
{
    public DateTime Timestamp { get; init; }

    public required string EventName { get; init; }

    public Guid ItemId { get; init; }

    public Guid ParentId { get; init; }

    public int Version { get; set; }

    public string? Language { get; set; }

    public Guid[]? FieldIds { get; init; }

    public required string Raw { get; init; }

    public string? User { get; init; }

    public required string SitecoreInstance { get; init; }

    public string? ChangedFields { get; init; }
}
