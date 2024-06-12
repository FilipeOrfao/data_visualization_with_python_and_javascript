import scrapy
import re

BASE_URL = "http://en.wikipedia.org"


class NWinnerItem(scrapy.Item):
    name = scrapy.Field()
    link = scrapy.Field()
    year = scrapy.Field()
    category = scrapy.Field()
    country = scrapy.Field()
    gender = scrapy.Field()
    born_in = scrapy.Field()
    date_of_birth = scrapy.Field()
    date_of_death = scrapy.Field()
    place_of_birth = scrapy.Field()
    place_of_death = scrapy.Field()
    text = scrapy.Field()


class NWinnerSpider(scrapy.Spider):
    """Scrapes the country and link text of the Nobel-winners"""

    name = "nwinners_list"
    allowed_domains = ["en.wikipedia.org"]
    start_urls = ["http://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country"]

    def parse(self, response):
        h3s = response.xpath("//h3")

        for h3 in h3s:
            country = h3.xpath('span[@class="mw-headline"]/text()').extract()
            if country:
                winners = h3.xpath("following-sibling::ol[1]")
                for w in winners.xpath("li"):
                    # wdata = process_winner_li(w, country[0])
                    text = w.xpath("descendant-or-self::text()").extract()
                    yield NWinnerItem(
                        country=country[0], name=text[0], link_text=" ".join(text)
                    )
