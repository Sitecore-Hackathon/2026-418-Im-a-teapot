namespace CoordinatorApi.Shared;

public class SitecoreWebHookModel
{
    public required string EventName { get; set; }

    public ItemModel? Item { get; set; }

    public ItemChanges? Changes { get; set; }

}

public class ItemModel
{
    public required string Language { get; set; }

    public int Version { get; set; }

    public Guid Id { get; set; }

    public required string Name { get; set; }

    public Guid ParentId { get; set; }

    public Guid TemplateId { get; set; }

    public ICollection<FieldDate>? SharedFields { get; set; }

    public ICollection<FieldDate>? UnversionedFields { get; set; }

    public ICollection<FieldDate>? VersionedFields { get; set; }

}

public class FieldDate
{
    public Guid Id { get; set; }
    public string? Value { get; set; }
}

public class ItemChanges
{
    public IEnumerable<FieldChange> FieldChanges { get; set; } = [];

    public bool IsUnversionedFieldChanged { get; set; }
    public bool IsSharedFieldChanged { get; set; }
}

public class FieldChange
{
    public Guid FieldId { get; set; }

    public string? Value { get; set; }

    public string? OriginalValue { get; set; }
}
