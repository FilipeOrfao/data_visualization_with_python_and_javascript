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
        filename = response.url.split("/")[-1]
        h3s = response.xpath("//h3")

        for h3 in h3s:
            country = h3.xpath('span[@class="mw-headline"]/text()').extract()
            if country:
                winners = h3.xpath("following-sibling::ol[1]")
                for w in winners.xpath("li"):
                    # text = w.xpath("descendant-or-self::text()").extract()
                    wdata = process_winner_li(w, country[0])
                    if "link" in wdata:
                        request = scrapy.Request(
                            wdata["link"],
                            callback=self.parse_bio,
                            dont_filter=True,
                        )
                        request.meta["item"] = NWinnerItem(**wdata)
                        yield request
                        # yield NWinnerItem(**wdata)

    def parse_bio(self, response):
        item = response.meta["item"]
        href = response.xpath('//li[@id="t-wikibase"]/a/@href').extract()
        if href:
            url = href[0]
            wiki_code = url.split("/")[-1]
            url = "https://wikidata.org/wiki/" + wiki_code
            request = scrapy.Request(
                url,
                callback=self.parse_wikidata,
                dont_filter=True,
            )
            request.meta["item"] = item
            yield request

    def parse_wikidata(self, response):
        item = response.meta["item"]
        property_codes = [
            {"name": "date_of_birth", "code": "P569"},
            {"name": "date_of_death", "code": "P570"},
            {"name": "place_of_birth", "code": "P19", "link": True},
            {"name": "place_of_death", "code": "P20", "link": True},
            {"name": "gender", "code": "P21", "link": True},
        ]

        for prop in property_codes:
            link_html = ""
            if prop.get("link"):
                link_html = "/a"
            # select div with property-code id
            code_block = response.xpath(f'//*[@id="{prop["code"]}"]')
            # continure if the code_clock exists
            if code_block:
                # we can use the css selector, which has superior class selection
                values = code_block.css(".wikibase-snakview-value")
                # the first value coresponds to the code property eg '10 August 1879'
                value = values[0]
                prop_sel = value.xpath(f".{link_html}/text()")
                if prop_sel:
                    item[prop["name"]] = prop_sel[0].extract()

        yield item


def process_winner_li(w, country=None):
    wdata = {}
    # get the href link address from the <a> tag
    if w.xpath("a/@href").extract():
        wdata["link"] = BASE_URL + w.xpath("a/@href").extract()[0]
    text = " ".join(w.xpath("descendant-or-self::text()").extract())
    # get comma-delineated name and strip trailing witespace
    wdata["name"] = text.split(",")[0].strip()

    year = re.findall("\d{4}", text)
    if year:
        wdata["year"] = int(year[0])
    else:
        wdata["year"] = 0
        print(f"Opps, no year in {text}")

    category = re.findall(
        r"Physics|Chemistry|Physiology or Medicine|Literature|Peace|Economics", text
    )

    if category:
        wdata["category"] = category[0]
    else:
        wdata["category"] = ""
        print(f"Opps, no category in {text}")

    if country:
        if text.find("*") != -1:
            wdata["country"] = ""
            wdata["born_in"] = country
        else:
            wdata["country"] = country
            wdata["born_in"] = ""

    wdata["text"] = text
    return wdata
