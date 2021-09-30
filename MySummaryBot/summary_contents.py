#-*- coding:utf-8 -*-

# from __future__ import print_function
# from textrankr import TextRank
# import os, sys

# #textrank = TextRank("나는 프로그래머 입니다. 자바 프로그래머, 그냥 프로그래머");
# print(sys.argv[1]);
# textrank = TextRank(sys.argv[1]);
# print(textrank.summarize())

from typing import List
from textrankr import TextRank
import os, sys

class MyTokenizer:
    def __call__(self, text: str) -> List[str]:
        tokens: List[str] = text.split()
        return tokens

mytokenizer: MyTokenizer = MyTokenizer()
textrank: TextRank = TextRank(mytokenizer)

k: int = 3  # num sentences in the resulting summary

summarized: str = textrank.summarize(sys.argv[1], k)
print(summarized)  # gives you some text

# if verbose = False, it returns a list
# summaries: List[str] = textrank.summarize(sys.argv[1], k, verbose=False)
# for summary in summaries:
#     print(summary)