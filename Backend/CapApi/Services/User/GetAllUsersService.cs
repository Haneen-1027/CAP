using Microsoft.AspNetCore.Mvc;
using CapApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using CapApi.Dtos.User;

namespace CapApi.Services.User;

public class GetAllUsersService(CapDbContext context, ILogger<GetAllUsersService> logger)
{
    private readonly CapDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
    private readonly ILogger<GetAllUsersService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<IActionResult> Handle(
        int page,
        int pageSize,
        string searchTerm,
        string roleFilter,
        string sortBy,
        bool ascending)
    {
        try
        {
            // Validate pagination parameters
            if (page < 1 || pageSize < 1)
            {
                _logger.LogWarning("Invalid pagination parameters: page={Page}, pageSize={PageSize}", page, pageSize);
                return new BadRequestObjectResult("Page and pageSize must be greater than zero.");
            }

            // Start building the query
            var query = _context.Users.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.Trim().ToLower();
                query = query.Where(u => u.FirstName.ToLower().Contains(searchTerm) ||
                                        u.LastName.ToLower().Contains(searchTerm) ||
                                        u.Email.ToLower().Contains(searchTerm));
            }

            // Apply role filter
            if (!string.IsNullOrWhiteSpace(roleFilter))
            {
                query = query.Where(u => u.Role == roleFilter);
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                string orderBy = ascending ? $"{sortBy} ASC" : $"{sortBy} DESC";
                query = query.OrderBy(orderBy);
            }

            // Get total count for pagination
            int totalCount = await query.CountAsync();

            // Apply pagination
            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(user => new GetUserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    Username = user.Username,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                })
                .ToListAsync();

            // Return paginated result
            var result = new
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                Users = users
            };

            return new OkObjectResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving users.");
            return new ObjectResult("An internal error occurred while retrieving users.") { StatusCode = 500 };
        }
    }
}