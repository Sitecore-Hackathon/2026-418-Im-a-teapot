

namespace CoordinatorApi.Shared;

public class IndexChangeModel
{
    public DateTime Timestamp { get; set; }

    public required string EventName { get; set; }

    public Guid ItemId { get; set; }

    public Guid ParentId { get; set; }

    public int Version { get; set; }

    public string? Language { get; set; }

    public Guid[]? FieldIds { get; set; }

    public required string Raw { get; set; }

    public string? User { get; set; }

    public required string SitecoreInstance { get; set; }

    public string? ChangedFields { get; set; }
}
