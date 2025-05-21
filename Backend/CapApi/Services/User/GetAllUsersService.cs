using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;
using CapApi.Models;

namespace CapApi.Services.User;

public class GetAllUsersService(CapDbContext context, ILogger<GetAllUsersService> logger)
{
    private readonly CapDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
    private readonly ILogger<GetAllUsersService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<IActionResult> Handle(
        int page = 1, 
        int pageSize = 10,
        string searchTerm = "",
        string roleFilter = "",
        string sortBy = "Id",
        bool ascending = true)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Validate parameters
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;
            
            // Base query
            var query = _context.Users.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(u => 
                    (u.FirstName + " " + u.LastName).ToLower().Contains(searchTerm) ||
                    u.Username.ToLower().Contains(searchTerm) ||
                    u.Email.ToLower().Contains(searchTerm));
            }

            // Apply role filter
            if (!string.IsNullOrWhiteSpace(roleFilter) && roleFilter != "-999")
            {
                query = query.Where(u => u.Role == roleFilter);
            }

            // Apply sorting without dynamic LINQ
            query = sortBy.ToLower() switch
            {
                "name" => ascending 
                    ? query.OrderBy(u => u.FirstName).ThenBy(u => u.LastName)
                    : query.OrderByDescending(u => u.FirstName).ThenByDescending(u => u.LastName),
                "username" => ascending 
                    ? query.OrderBy(u => u.Username)
                    : query.OrderByDescending(u => u.Username),
                "email" => ascending 
                    ? query.OrderBy(u => u.Email)
                    : query.OrderByDescending(u => u.Email),
                "role" => ascending 
                    ? query.OrderBy(u => u.Role)
                    : query.OrderByDescending(u => u.Role),
                "createdat" => ascending 
                    ? query.OrderBy(u => u.CreatedAt)
                    : query.OrderByDescending(u => u.CreatedAt),
                _ => ascending 
                    ? query.OrderBy(u => u.Id)
                    : query.OrderByDescending(u => u.Id)
            };

            // Get total count after filtering
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            // Apply pagination
            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Response object
            var response = new
            {
                Data = users,
                Pagination = new
                {
                    TotalCount = totalCount,
                    PageSize = pageSize,
                    CurrentPage = page,
                    TotalPages = totalPages,
                    HasPrevious = page > 1,
                    HasNext = page < totalPages
                }
            };

            await transaction.CommitAsync();
            return new OkObjectResult(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error fetching users");
            return new ObjectResult(new 
            { 
                Message = "An error occurred while fetching users.",
                Error = ex.Message 
            }) 
            { 
                StatusCode = 500 
            };
        }
    }
}