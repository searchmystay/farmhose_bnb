from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from pytz import timezone
from ..logics.farmhouse_analysis_aggregation import run_monthly_aggregation


def get_ist_timezone():
    tz = timezone('Asia/Kolkata')
    return tz


def create_scheduler():
    scheduler = BackgroundScheduler()
    return scheduler


def add_monthly_job(scheduler):
    ist_tz = get_ist_timezone()
    
    scheduler.add_job(
        run_monthly_aggregation,
        trigger=CronTrigger(
            day='last',
            hour=23,
            minute=59,
            timezone=ist_tz
        ),
        id='monthly_aggregation',
        name='Aggregate monthly analytics data',
        replace_existing=True
    )
    
    return True


def start_scheduler():
    scheduler = create_scheduler()
    add_monthly_job(scheduler)
    scheduler.start()
    return True
