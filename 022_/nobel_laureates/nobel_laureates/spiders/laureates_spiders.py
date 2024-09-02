import scrapy
import re
from datetime import datetime
from nobel_laureates.items import NWinnerItem


class ListSpider(scrapy.Spider):
    name = "laureates_list"
    allowed_domains = ["en.wikipedia.org"]
    start_urls = ["http://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country"]

    def parse(self, response):

        countries = response.xpath("//h3")

        for l in response.css("ol>li:has(>a)")[:100]:
            nwinner = NWinnerItem()

            nwinner["name"] = l.css("a::text").get()
            # nwinner["country"] = l.xpath("preceding::h3[1]").xpath("text()").get()
            # try:
            #     nwinner["category"] = l.get().split(",")[-2].strip()
            # except:
            #     nwinner["category"] = None
            # try:
            #     nwinner["year"] = int(re.findall("\d{4}", l.get().split(",")[-1])[0])
            # except:
            #     nwinner["year"] = None
            nwinner["link"] = f'{l.css("a::attr(href)").get()}'

            # yield nwinner

            request = scrapy.Request(
                f'https://en.wikipedia.org{nwinner["link"]}',
                callback=self.parse_bio,
                dont_filter=True,
            )

            request.meta["item"] = nwinner

            yield request

    def parse_bio(self, response):
        item = response.meta["item"]
        # item["country"] = response.xpath(
        #     "//span[@class='bday']/parent::*/parent::*//text()"
        # ).getall()[-1]
        # item["born_in"] = response.css(".infobox-data .bday::text").get()
        # some people do not have .bday
        try:
            # birth_info = response.xpath("//td[@class='infobox-data']")[0].get()
            birth_info = response.xpath("//tr[contains(., 'Born')]/td")[0].get()
            item["date_of_birth"] = extract_date(birth_info)

            # item["date_of_birth"] = item["date_of_birth"].replace(",", "")
            item["date_of_birth"] = fix_date(item["date_of_birth"])

        except IndexError:
            item["date_of_birth"] = None

        try:
            # death_info = response.xpath("//td[@class='infobox-data']")[0].get()
            death_info = response.xpath("//tr[contains(., 'Died')]/td")[0].get()
            item["date_of_death"] = re.findall(
                r"\b(\d{1,2} (?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4}|(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4})\b",
                death_info,
            )[0]

            # item["date_of_birth"] = item["date_of_birth"].replace(",", "")
            item["date_of_death"] = fix_date(item["date_of_death"])

        except IndexError:
            item["date_of_death"] = None

        # fix this because it does not work for everyone use their position in the list
        try:
            item["place_of_birth"] = (
                response.xpath("//span[@class='bday']/parent::*/parent::*//text()")
                .getall()[-1]
                .split(",")[-1]
                .strip()
            )
        except IndexError:
            item["place_of_birth"] = None

        # try:
        #     item["place_of_death"] = (
        #         response.xpath(
        #             "//span[@class='bday']/parent::*/parent::*/parent::*/following-sibling::*[1]//text()"
        #         )
        #         .getall()[-1]
        #         .split(",")[-1]
        #         .strip()
        #     )
        # except IndexError:
        #     item["place_of_death"] = None

        # try:
        #     item["profile_pic"] = (
        #         f'https:{"/".join(response.css(".mw-file-element::attr(src)").get().split("/")[:-1])}'.replace(
        #             "/thumb", ""
        #         )
        #     )
        # except:
        #     item["profile_pic"] = None

        # try:
        #     item["award_age"] = item["year"] - int(item["date_of_birth"][-4:])
        # except:
        #     item["award_age"] = None

        # item["text"] = response.xpath(
        #     "/html/body/div[2]/div/div[3]/main/div[3]/div[3]/div[1]/p[2]"
        # ).extract()[0]

        yield item


def extract_date(element):
    date = re.findall(
        r"\b(\d{1,2} (?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4}|(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4})\b",
        element,
    )[0]
    return date


def fix_date(date):

    if date[0].isdigit():
        formatted_dates = datetime.strptime(date, "%d %B %Y").timestamp()
    else:
        formatted_dates = datetime.strptime(date, "%B %d %Y").timestamp()
    # return date
    return formatted_dates
