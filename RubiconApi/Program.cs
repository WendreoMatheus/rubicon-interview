using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// TODO 1: Register IProductService in the DI container
// builder.Services.AddSingleton<IProductService, ProductService>();

var app = builder.Build();

app.UseCors();

// TODO 2: Implement GET /api/products
// Requirements:
//   - Inject IProductService via parameter
//   - Return 200 OK with product list as JSON
//   - Handle FileNotFoundException → 404
//   - Handle any other exception → 500
//
// Bonus: accept ?category= and ?status= as optional query params

app.MapGet("/api/products", () =>
{
    return Results.Ok(new { message = "Not implemented yet" });
});

app.Run();

// ── Models ────────────────────────────────────────────────────

public record Product(
    int Id,
    string Name,
    string Category,
    decimal Price,
    int Stock,
    string Status,
    string CreatedAt
);

// ── Interface ─────────────────────────────────────────────────

public interface IProductService
{
    // TODO 3: Define GetAll() method signature
}

// ── Service ───────────────────────────────────────────────────

public class ProductService : IProductService
{
    private readonly string _csvPath;

    public ProductService()
    {
        // TODO 4: Set _csvPath to the correct location of products.csv
        //         Tip: Path.Combine(AppContext.BaseDirectory, "products.csv")
        _csvPath = "products.csv";
    }

    // TODO 5: Implement GetAll()
    //   - Throw FileNotFoundException if file doesn't exist
    //   - Use CsvHelper with HasHeaderRecord = true
    //   - Return csv.GetRecords<Product>().ToList()
}
