# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class NobelLaureatesItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass


class NWinnerItem(scrapy.Item):
    name = scrapy.Field()  #
    link = scrapy.Field()  #
    year = scrapy.Field()  #
    category = scrapy.Field()  #
    gender = scrapy.Field()  #
    award_age = scrapy.Field()  #
    date_of_birth = scrapy.Field()  #
    country = scrapy.Field()  #
    date_of_death = scrapy.Field()  #
    place_of_birth = scrapy.Field()  #
    place_of_death = scrapy.Field()
    image_urls = scrapy.Field()  #
    text = scrapy.Field()  #
