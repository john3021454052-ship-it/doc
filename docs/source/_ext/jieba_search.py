"""
Sphinx extension for integrating jieba Chinese word segmentation into search.
"""

import jieba
from sphinx.search import SearchLanguage
from sphinx.util import logging

logger = logging.getLogger(__name__)


class ChineseSearchLanguage(SearchLanguage):
    """Chinese search language using jieba for word segmentation."""
    
    lang = 'zh'
    language_name = 'Chinese'
    
    def init(self, options):
        """Initialize jieba."""
        try:
            # Initialize jieba
            jieba.initialize()
            logger.info('Jieba initialized successfully for Chinese search')
        except Exception as e:
            logger.warning(f'Failed to initialize jieba: {e}')
    
    def split(self, input_text):
        """Split Chinese text using jieba."""
        if not input_text:
            return []
        
        # Use jieba to segment Chinese text
        words = jieba.cut_for_search(input_text)
        return [word.lower() for word in words if word.strip()]
    
    def word_filter(self, word):
        """Filter out stop words and short words."""
        # Common Chinese stop words
        stop_words = {
            '的', '了', '在', '是', '我', '有', '和', '就', '不', '人',
            '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去',
            '你', '会', '着', '没有', '看', '好', '自己', '这', '那'
        }
        
        if len(word) < 2:
            return False
        
        if word in stop_words:
            return False
        
        return True


def setup(app):
    """Setup the extension."""
    app.add_search_language(ChineseSearchLanguage)
    
    return {
        'version': '1.0',
        'parallel_read_safe': True,
        'parallel_write_safe': True,
    }
