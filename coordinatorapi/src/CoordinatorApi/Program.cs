using CoordinatorApi.Receive;

var builder = WebApplication.CreateBuilder(args);

builder.AddReceive();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.MapReceive();
app.Map("/", () => Results.Text("Hello!"));

app.Run();
