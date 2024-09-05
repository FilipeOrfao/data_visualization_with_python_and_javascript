import scrapy
import re
from datetime import datetime
from nobel_laureates.items import NWinnerItem


class ListSpider(scrapy.Spider):
    name = "laureates_list"
    # allowed_domains = ["en.wikipedia.org"]
    start_urls = ["http://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country"]

    # custom_settings = {
    #     "ITEM_PIPELINES": {"scrapy.pipelines.images.ImagesPipeline": 300},
    # }

    def parse(self, response):

        for l in response.css("ol>li:has(>a)"):

            nwinner = NWinnerItem()

            nwinner["name"] = l.css("a::text").get()
            nwinner["country"] = l.xpath("preceding::h3[1]").xpath("text()").get()
            try:
                nwinner["category"] = l.get().split(",")[-2].strip()
            except:
                nwinner["category"] = None
            try:
                nwinner["year"] = int(re.findall("\d{4}", l.get().split(",")[-1])[0])
            except:
                nwinner["year"] = None
            nwinner["link"] = f'{l.css("a::attr(href)").get()}'

            request = scrapy.Request(
                f'https://en.wikipedia.org{nwinner["link"]}',
                callback=self.parse_bio,
                dont_filter=True,
            )

            request.meta["item"] = nwinner

            yield request

    def parse_bio(self, response):
        item = response.meta["item"]

        # some people just have the year
        # getting date of birth
        try:
            birth_info = response.xpath("//tr[contains(., 'Born')]/td")[0].get()
            item["date_of_birth"] = extract_date(birth_info)

            item["date_of_birth"] = fix_date(item["date_of_birth"])

        except IndexError:
            item["date_of_birth"] = None

        # getting date of death
        try:
            death_info = response.xpath("//tr[contains(., 'Died')]/td")[0].get()
            item["date_of_death"] = extract_date(death_info)
            item["date_of_death"] = fix_date(item["date_of_death"])

        except IndexError:
            item["date_of_death"] = None

        # fix this because it does not work for everyone use their position in the list
        try:
            item["place_of_birth"] = extract_country(birth_info)
        except IndexError as e:
            print(e)
            item["place_of_birth"] = None

        try:
            if death_info:
                item["place_of_death"] = extract_country(death_info)
            else:
                item["place_of_death"] = None
        except UnboundLocalError as e:
            print(e)
            item["place_of_death"] = None

        try:

            item["image_urls"] = [
                f'https:{"/".join(response.css(".infobox.vcard img::attr(src)").get().split("/")[:-1])}'.replace(
                    "/thumb", ""
                )
            ]

        except:
            item["image_urls"] = None

        try:
            item["award_age"] = int(item["year"]) - int(
                datetime.fromtimestamp(item["date_of_birth"]).strftime("%Y")
            )
        except:
            item["award_age"] = None

        item["gender"] = gender_cal(response)

        item["text"] = response.xpath(
            "/html/body/div[2]/div/div[3]/main/div[3]/div[3]/div[1]/p[2]"
        ).extract()[0]

        yield item


def extract_date(element):
    date = re.findall(
        r"\b(\d{1,2} (?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4}|(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4})\b",
        element,
    )[0]
    return date


def fix_date(date):
    formatted_date = date.replace(",", "")
    print(formatted_date)
    if formatted_date[0].isdigit():
        formatted_date = datetime.strptime(formatted_date, "%d %B %Y").timestamp()
    else:
        formatted_date = datetime.strptime(formatted_date, "%B %d %Y").timestamp()
    # return date
    return formatted_date


def extract_country(birth_info):
    birth_country = re.findall(
        r"(>*,*\s*\w+\s*\w*\s*\w*\s*\w*<|U\.S\.|US)", birth_info
    )[-1]
    birth_country = (
        birth_country.replace("<", "").replace(">", "").replace(",", "").strip()
    )
    return birth_country


def gender_cal(html):
    html_text = " ".join([i.get() for i in html.css("p::text")])
    male = len(
        re.findall(r"( he\.*\s*| him\.*\s*| his\.*\s*| He\.*\s*| Him\.*\s*)", html_text)
    )
    female = len(
        re.findall(r"( she\.*\s*| her\.*\s*| She\.*\s*| Her\.*\s*)", html_text)
    )
    if male > female:
        return "male"
    elif male < female:
        return "female"
    else:
        return None
