from src.database.migrations.add_monthly_summary import run_migration, count_documents_without_field
from src.database import db
from src.utils.exception_handler import handle_exceptions


@handle_exceptions
def show_before_state():
    total_count = db["farmhouse_analysis"].count_documents({})
    without_field_count = count_documents_without_field()
    
    print("=" * 50)
    print("BEFORE MIGRATION:")
    print("=" * 50)
    print(f"Total documents in farmhouse_analysis: {total_count}")
    print(f"Documents WITHOUT monthly_summary: {without_field_count}")
    print(f"Documents WITH monthly_summary: {total_count - without_field_count}")
    print()
    
    return without_field_count


@handle_exceptions
def show_after_state():
    total_count = db["farmhouse_analysis"].count_documents({})
    without_field_count = count_documents_without_field()
    
    print("=" * 50)
    print("AFTER MIGRATION:")
    print("=" * 50)
    print(f"Total documents in farmhouse_analysis: {total_count}")
    print(f"Documents WITHOUT monthly_summary: {without_field_count}")
    print(f"Documents WITH monthly_summary: {total_count - without_field_count}")
    print()


@handle_exceptions
def execute_migration():
    docs_to_update = show_before_state()
    
    if docs_to_update == 0:
        print("✅ All documents already have monthly_summary field!")
        print("No migration needed.")
        return True
    
    print(f"🔄 Updating {docs_to_update} documents...")
    result = run_migration()
    print()
    
    show_after_state()
    
    return result


if __name__ == '__main__':
    success = execute_migration()
    
    if success:
        print("=" * 50)
        print("✅ Migration completed successfully!")
        print("=" * 50)
    else:
        print("=" * 50)
        print("❌ Migration failed!")
        print("=" * 50)
