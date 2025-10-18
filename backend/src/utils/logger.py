import logging
import os
from logging.handlers import RotatingFileHandler
from ..config import BACKEND_DIR

def setup_logger():
    log_file = os.path.join(BACKEND_DIR, "app.log")
    
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s'
    )
    
    file_handler = RotatingFileHandler(
        log_file, 
        maxBytes=10*1024*1024,  
        backupCount=3
    )
    file_handler.setFormatter(formatter)
    
    logger = logging.getLogger('app_logger')
    logger.setLevel(logging.INFO)
    logger.addHandler(file_handler)
    
    return logger

logger = setup_logger()
