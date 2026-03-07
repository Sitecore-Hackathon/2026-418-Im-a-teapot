# Agent Guidelines for CoordinatorApi

This document provides guidelines for agentic coding agents operating in the **CoordinatorApi** repository.

---

## 📦 Build, Lint, and Test Commands

### Build

```bash
# Build the solution
dotnet build

# Build in Release mode
 dotnet build --configuration Release

 # Build in Release mode
 dotnet build --configuration Debug
```

### Run

```bash
# Run the application
dotnet run --project src/CoordinatorApi/CoordinatorApi.csproj
```

### Lint and Format

```bash
# Check code style and formatting (using .editorconfig)
dotnet format --verify-no-changes

# Apply code formatting
dotnet format
```

---

## 📜 Code Style Guidelines

### General

- **Language**: C# 10+ (`.NET 10.0`).
- **Indentation**: 4 spaces (no tabs).
- **Line Endings**: LF (`
`).
- **File Encoding**: UTF-8.

### Imports and Usings

- Use **file-scoped namespaces** (preferred) or block-scoped namespaces.
- Sort `using` directives **outside the namespace** (alphabetically, system namespaces first).
- Remove unused `using` directives.
- Prefer **explicit imports** over global/implicit usings.

### Formatting

- **Braces**: Always use braces (`{ }`) for control structures (e.g., `if`, `for`, `while`).
- **Newlines**:
    - Before `catch`, `else`, `finally`, and members in object/collection initializers.
    - Between query expression clauses.
- **Spaces**:
    - Around binary operators (e.g., `+`, `-`, `=`, `==`).
    - After commas and semicolons (e.g., `for (int i = 0; i < 10; i++)`).
    - After keywords in control flow (e.g., `if (condition)`).
- **Indentation**:
    - Indent block contents, case contents, and switch labels.
    - Labels are indented **one less** than the current level.

### Types and Variables

- **Naming**:
    - **PascalCase** for types (classes, interfaces, enums, structs), methods, properties, and events.
    - **camelCase** for local variables, parameters, and private fields.
    - **`_fieldName`** for private or internal fields (leading underscore + camelCase).
    - **`I` prefix** for interfaces (e.g., `IStorageClient`).
- **Nullability**: Enable nullable reference types (`<Nullable>enable</Nullable>`).
- **Immutability**: Prefer `readonly` fields and immutable collections.
- **Var**: Use `var` for local variables when the type is **obvious** (e.g., `var list = new List<int>();`).

### Methods and Functions

- **Naming**: Use **PascalCase** and **verb-noun** pairs (e.g., `GetItems`, `EnsureIndex`).
- **Parameters**: Use **camelCase** and validate inputs (e.g., `ArgumentNullException.ThrowIfNull`).
- **Async/Await**: Always suffix async methods with `Async` (e.g., `GetItemsAsync`).
- **Expression-Bodied Members**: Use for **single-line** methods, properties, and accessors.

### Error Handling

- **Exceptions**:
    - Throw **specific exceptions** (e.g., `ArgumentNullException`, `InvalidOperationException`).
    - Avoid catching generic `Exception` unless rethrowing or logging.
    - Use `TryGetOriginalException` to unwrap Elasticsearch exceptions.
    - Include **contextual messages** (e.g., `"Communication error while querying data."`).
- **Logging**: Use `ILogger<T>` for structured logging (e.g., `logger.LogInformation("Received from {SitecoreId}", sitecoreInstanceId);`).

### Classes and Interfaces

- **Accessibility**: Explicitly declare accessibility (e.g., `public`, `private`, `internal`).
- **Modifiers**: Order modifiers as follows:
  `public`, `private`, `protected`, `internal`, `static`, `extern`, `new`, `virtual`, `abstract`, `sealed`, `override`, `readonly`, `unsafe`, `required`, `volatile`, `async`.
- **Constructors**: Prefer **primary constructors** for dependency injection (e.g., `public class QueryService(ElasticsearchClient client)`).

### JSON and Serialization

- Use `System.Text.Json` for JSON serialization/deserialization.
- Prefer **async methods** (`JsonSerializer.SerializeAsync`).
- Handle `null` values explicitly.

### Elasticsearch

- **Client**: Use `Elastic.Clients.Elasticsearch` (v9.3.1).
- **Error Handling**: Check `response.IsValidResponse` and unwrap exceptions with `TryGetOriginalException`.
- **Indices**: Use **monthly indices** (e.g., `audit-2026.03`).

### Testing

- **Framework**: Use **xUnit** or **NUnit** (if test projects exist).
- **Naming**: Follow **`Method_Scenario_ExpectedBehavior`** (e.g., `Add_ValidModel_StoresInElasticsearch`).
- **Mocking**: Use **Moq** or **NSubstitute** for dependencies.
- **Assertions**: Be **specific** (e.g., `Assert.Equal(expected, actual)`).

---

## 🔧 EditorConfig Rules

Key rules from `.editorconfig`:

- **Indentation**: 4 spaces.
- **Braces**: Always use braces for control structures.
- **File-Scoped Namespaces**: Preferred.
- **Naming**:
    - Interfaces: `I` prefix (e.g., `IStorageClient`).
    - Private fields: `_fieldName`.
    - Types: PascalCase.
- **Null Checks**: Prefer `is null` over `== null`.
- **Pattern Matching**: Prefer `switch` expressions and pattern matching.
- **Readonly**: Prefer `readonly` fields and structs.

---

## 🚫 Anti-Patterns

- **Magic Numbers/Strings**: Avoid hardcoded values (e.g., `_fieldIdEditor`). Use `const` or `static readonly`.
- **Deep Nesting**: Avoid excessive nesting (e.g., `if` inside `if`). Use early returns or guard clauses.
- **Long Methods**: Break methods into smaller, focused units.
- **Unvalidated Inputs**: Always validate method parameters (e.g., `ArgumentNullException.ThrowIfNull`).
- **Swallowing Exceptions**: Never catch and ignore exceptions unless absolutely necessary.

---

## ✅ Best Practices

- **Dependency Injection**: Use constructor injection (e.g., `public QueryService(ElasticsearchClient client)`).
- **Cancellation**: Always support `CancellationToken` in async methods.
- **Logging**: Use structured logging (e.g., `logger.LogInformation("Received from {SitecoreId}", sitecoreInstanceId);`).
- **Immutability**: Prefer immutable objects and `readonly` fields.
- **Async/Await**: Avoid `Task.Wait()` or `Task.Result`. Use `await`.
- **Disposables**: Always dispose `IDisposable` objects (e.g., `StreamReader`, `MemoryStream`).

---

## 📁 Project Structure

```
/src
  /CoordinatorApi
    ├── /ElasticsearchStorage  # Elasticsearch client and storage logic
    ├── /Query                 # Query endpoints and services
    ├── /Receive               # Webhook receiver logic
    ├── /Shared                # Shared models and interfaces
    ├── Program.cs             # Entry point
    └── CoordinatorApi.csproj  # Project file
```
