﻿// <auto-generated />
using System;
using CapApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CapApi.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("CapApi.Models.Assessment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("AssessmentDate")
                        .HasColumnType("datetime2")
                        .HasColumnName("AssessmentDate");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<TimeSpan>("Duration")
                        .HasColumnType("time");

                    b.Property<TimeSpan>("EndTime")
                        .HasColumnType("time");

                    b.Property<string>("Name")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<int>("QuestionsCount")
                        .HasColumnType("int");

                    b.Property<TimeSpan>("StartTime")
                        .HasColumnType("time");

                    b.Property<int>("TotalMark")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("Assessments");
                });

            modelBuilder.Entity("CapApi.Models.AssessmentQuestion", b =>
                {
                    b.Property<int>("AssessmentId")
                        .HasColumnType("int");

                    b.Property<int>("QuestionId")
                        .HasColumnType("int");

                    b.Property<int>("Mark")
                        .HasColumnType("int");

                    b.HasKey("AssessmentId", "QuestionId");

                    b.HasIndex("QuestionId");

                    b.ToTable("AssessmentQuestions");
                });

            modelBuilder.Entity("CapApi.Models.CodingQuestion", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<int>("InputsCount")
                        .HasColumnType("int");

                    b.Property<int>("QuestionId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("QuestionId")
                        .IsUnique();

                    b.ToTable("CodingQuestions");
                });

            modelBuilder.Entity("CapApi.Models.EssayQuestion", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("QuestionId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("QuestionId")
                        .IsUnique();

                    b.ToTable("EssayQuestions");
                });

            modelBuilder.Entity("CapApi.Models.McqQuestion", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("CorrectAnswer")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime?>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<bool?>("IsTrueFalse")
                        .HasColumnType("bit");

                    b.Property<int>("QuestionId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.PrimitiveCollection<string>("WrongOptions")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("QuestionId")
                        .IsUnique();

                    b.ToTable("McqQuestions");
                });

            modelBuilder.Entity("CapApi.Models.Question", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Category")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Prompt")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Type")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("Questions");
                });

            modelBuilder.Entity("CapApi.Models.TestCase", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CodingQuestionId")
                        .HasColumnType("int");

                    b.Property<string>("ExpectedOutput")
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)");

                    b.PrimitiveCollection<string>("Inputs")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CodingQuestionId");

                    b.ToTable("TestCases");
                });

            modelBuilder.Entity("CapApi.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("FirstName")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("LastName")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Password")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Role")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Username")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique()
                        .HasFilter("[Email] IS NOT NULL");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("CapApi.Models.AssessmentQuestion", b =>
                {
                    b.HasOne("CapApi.Models.Assessment", "Assessment")
                        .WithMany("AssessmentQuestions")
                        .HasForeignKey("AssessmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CapApi.Models.Question", "Question")
                        .WithMany("AssessmentQuestions")
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Assessment");

                    b.Navigation("Question");
                });

            modelBuilder.Entity("CapApi.Models.CodingQuestion", b =>
                {
                    b.HasOne("CapApi.Models.Question", "Question")
                        .WithOne("CodingQuestion")
                        .HasForeignKey("CapApi.Models.CodingQuestion", "QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Question");
                });

            modelBuilder.Entity("CapApi.Models.EssayQuestion", b =>
                {
                    b.HasOne("CapApi.Models.Question", "Question")
                        .WithOne("EssayQuestion")
                        .HasForeignKey("CapApi.Models.EssayQuestion", "QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Question");
                });

            modelBuilder.Entity("CapApi.Models.McqQuestion", b =>
                {
                    b.HasOne("CapApi.Models.Question", "Question")
                        .WithOne("McqQuestion")
                        .HasForeignKey("CapApi.Models.McqQuestion", "QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Question");
                });

            modelBuilder.Entity("CapApi.Models.TestCase", b =>
                {
                    b.HasOne("CapApi.Models.CodingQuestion", "CodingQuestion")
                        .WithMany("TestCases")
                        .HasForeignKey("CodingQuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CodingQuestion");
                });

            modelBuilder.Entity("CapApi.Models.Assessment", b =>
                {
                    b.Navigation("AssessmentQuestions");
                });

            modelBuilder.Entity("CapApi.Models.CodingQuestion", b =>
                {
                    b.Navigation("TestCases");
                });

            modelBuilder.Entity("CapApi.Models.Question", b =>
                {
                    b.Navigation("AssessmentQuestions");

                    b.Navigation("CodingQuestion");

                    b.Navigation("EssayQuestion");

                    b.Navigation("McqQuestion");
                });
#pragma warning restore 612, 618
        }
    }
}
