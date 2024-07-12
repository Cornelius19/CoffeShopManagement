using System;
using System.Collections.Generic;
using CoffeBarManagement.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace CoffeBarManagement.Data;

public partial class ApplicationContext : DbContext
{
    public ApplicationContext()
    {
    }

    public ApplicationContext(DbContextOptions<ApplicationContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<ComplexProductsComponent> ComplexProductsComponents { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderProduct> OrderProducts { get; set; }

    public virtual DbSet<Organization> Organizations { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<RemoveCategory> RemoveCategories { get; set; }

    public virtual DbSet<Reservation> Reservations { get; set; }

    public virtual DbSet<StockBalance> StockBalances { get; set; }

    public virtual DbSet<Table> Tables { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__D5B1EDCC5329F4ED");

            entity.ToTable("Category");

            entity.Property(e => e.CategoryId).HasColumnName("category_Id");
            entity.Property(e => e.AvailableMenu).HasColumnName("available_menu");
            entity.Property(e => e.CategoryName)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("category_Name");
        });

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.ClientId).HasName("PK__Clients__BF554B6C031D80B2");

            entity.Property(e => e.ClientId).HasColumnName("client_Id");
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("firstName");
            entity.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("lastName");
            entity.Property(e => e.Lock).HasColumnName("lock");
            entity.Property(e => e.PhoneNumber)
                .IsRequired()
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("phone_number");
            entity.Property(e => e.UserId)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("userId");
        });

        modelBuilder.Entity<ComplexProductsComponent>(entity =>
        {
            entity.HasKey(e => e.CpcId).HasName("PK__Complex___D46EB7C7EAB01305");

            entity.ToTable("Complex_Products_Components");

            entity.Property(e => e.CpcId).HasColumnName("cpc_Id");
            entity.Property(e => e.ComponentProductId).HasColumnName("component_product_Id");
            entity.Property(e => e.TargetProductId).HasColumnName("target_product_Id");
            entity.Property(e => e.UsageQuantity).HasColumnName("usage_quantity");

            entity.HasOne(d => d.ComponentProduct).WithMany(p => p.ComplexProductsComponentComponentProducts)
                .HasForeignKey(d => d.ComponentProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Complex_P__compo__5441852A");

            entity.HasOne(d => d.TargetProduct).WithMany(p => p.ComplexProductsComponentTargetProducts)
                .HasForeignKey(d => d.TargetProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Complex_P__targe__534D60F1");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.EmployeeId).HasName("PK__Employee__C51D78209EFA8C60");

            entity.ToTable("Employee");

            entity.Property(e => e.EmployeeId).HasColumnName("employee_Id");
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("firstName");
            entity.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("lastName");
            entity.Property(e => e.Lock).HasColumnName("lock");
            entity.Property(e => e.Role)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("role");
            entity.Property(e => e.Salary).HasColumnName("salary");
            entity.Property(e => e.UserId)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("userId");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__46466601393FE9C8");

            entity.Property(e => e.OrderId).HasColumnName("order_Id");
            entity.Property(e => e.ClientId).HasColumnName("client_Id");
            entity.Property(e => e.DeliveredEmployeeId).HasColumnName("delivered_employee_Id");
            entity.Property(e => e.OrderDate)
                .HasColumnType("datetime")
                .HasColumnName("order_date");
            entity.Property(e => e.OrderStatus)
                .HasDefaultValue(1)
                .HasColumnName("order_status");
            entity.Property(e => e.TableId).HasColumnName("table_Id");
            entity.Property(e => e.TakenEmployeeId).HasColumnName("taken_employee_Id");
            entity.Property(e => e.Tips).HasColumnName("tips");

            entity.HasOne(d => d.Client).WithMany(p => p.Orders)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK__Orders__client_I__5070F446");

            entity.HasOne(d => d.Table).WithMany(p => p.Orders)
                .HasForeignKey(d => d.TableId)
                .HasConstraintName("FK__Orders__table_Id__571DF1D5");

            entity.HasOne(d => d.TakenEmployee).WithMany(p => p.Orders)
                .HasForeignKey(d => d.TakenEmployeeId)
                .HasConstraintName("FK__Orders__taken_em__5165187F");
        });

        modelBuilder.Entity<OrderProduct>(entity =>
        {
            entity.HasKey(e => e.OrderProductsId).HasName("PK__Order_pr__52A0DDD80A340679");

            entity.ToTable("Order_products");

            entity.Property(e => e.OrderProductsId).HasColumnName("order_products_Id");
            entity.Property(e => e.OrderId).HasColumnName("order_Id");
            entity.Property(e => e.ProductId).HasColumnName("product_Id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.UnitPrice).HasColumnName("unit_Price");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderProducts)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order_pro__order__4E88ABD4");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderProducts)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order_pro__produ__4D94879B");
        });

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.HasKey(e => e.OrganizationId).HasName("PK__Organiza__C0B1F83A7073F3AB");

            entity.ToTable("Organization");

            entity.Property(e => e.OrganizationId).HasColumnName("organization_Id");
            entity.Property(e => e.Address)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Cif).HasColumnName("CIF");
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LogoPath)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Logo_Path");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.OpenStatus).HasColumnName("openStatus");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Products__4701761D1ADA2E3A");

            entity.Property(e => e.ProductId).HasColumnName("product_Id");
            entity.Property(e => e.AvailableForUser).HasColumnName("availableForUser");
            entity.Property(e => e.CategoryId).HasColumnName("category_Id");
            entity.Property(e => e.ComplexProduct).HasColumnName("complex_product");
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.SupplyCheck).HasColumnName("supplyCheck");
            entity.Property(e => e.Tva).HasColumnName("TVA");
            entity.Property(e => e.UnitMeasure)
                .IsRequired()
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("unit_measure");
            entity.Property(e => e.UnitPrice).HasColumnName("unit_price");

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Products__catego__52593CB8");
        });

        modelBuilder.Entity<RemoveCategory>(entity =>
        {
            entity.HasKey(e => e.RemoveCategoryId).HasName("PK__Remove_C__8C29EF039A1647C2");

            entity.ToTable("Remove_Category");

            entity.Property(e => e.RemoveCategoryId).HasColumnName("remove_category_Id");
            entity.Property(e => e.RemoveCategoryName)
                .IsRequired()
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("remove_category_Name");
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("PK__Reservat__314553E1E9238811");

            entity.Property(e => e.ReservationId).HasColumnName("reservation_Id");
            entity.Property(e => e.ClientId).HasColumnName("client_Id");
            entity.Property(e => e.Duration).HasColumnName("duration");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("firstName");
            entity.Property(e => e.GuestNumber).HasColumnName("guest_Number");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("lastName");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("phoneNumber");
            entity.Property(e => e.ReservationDate)
                .HasColumnType("datetime")
                .HasColumnName("reservation_Date");
            entity.Property(e => e.ReservationStatus).HasColumnName("reservation_Status");
            entity.Property(e => e.TableId).HasColumnName("table_Id");

            entity.HasOne(d => d.Client).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK__Reservati__clien__4F7CD00D");

            entity.HasOne(d => d.Table).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.TableId)
                .HasConstraintName("FK__Reservati__table__5812160E");
        });

        modelBuilder.Entity<StockBalance>(entity =>
        {
            entity.HasKey(e => e.StockBalanceId).HasName("PK__Stock_Ba__E6C1F7C793221E7D");

            entity.ToTable("Stock_Balance");

            entity.Property(e => e.StockBalanceId).HasColumnName("stock_balance_Id");
            entity.Property(e => e.BalanceDate)
                .HasColumnType("datetime")
                .HasColumnName("balance_date");
            entity.Property(e => e.ProductId).HasColumnName("product_Id");
            entity.Property(e => e.RemoveCategoryId).HasColumnName("remove_category_Id");
            entity.Property(e => e.RemoveQuantity).HasColumnName("remove_quantity");

            entity.HasOne(d => d.Product).WithMany(p => p.StockBalances)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Stock_Bal__produ__5629CD9C");

            entity.HasOne(d => d.RemoveCategory).WithMany(p => p.StockBalances)
                .HasForeignKey(d => d.RemoveCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Stock_Bal__remov__5535A963");
        });

        modelBuilder.Entity<Table>(entity =>
        {
            entity.HasKey(e => e.TableId).HasName("PK__Tables__B211834C131356CB");

            entity.Property(e => e.TableId).HasColumnName("table_Id");
            entity.Property(e => e.Capacity).HasColumnName("capacity");
            entity.Property(e => e.TableStatus).HasColumnName("table_status");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
