# A
student_data = [
    {"name": "Bob", "id": 0, "scores": [68, 75, 56, 81]},
    {"name": "Alice", "id": 1, "scores": [75, 90, 64, 88]},
    {"name": "Carol", "id": 2, "scores": [59, 74, 71, 68]},
    {"name": "Dan", "id": 3, "scores": [64, 58, 53, 62]},
]


# B
def process_student_data(data, pass_threshold=60, merit_threshold=75):
    """Perform some basic stats on some student data."""
    # C
    for sdata in data:
        av = sum(sdata["scores"]) / float(len(sdata["scores"]))
        if av > merit_threshold:
            sdata["assessment"] = "passed with merit"
        elif av >= pass_threshold:
            sdata["assessment"] = "passed"
        else:
            sdata["assessment"] = "failed"
            # D
            print(
                f"{sdata['name']}'s (id: {sdata['id']}) final assessment is:\
            {sdata['assessment'].upper()}"
            )
            # For Python versions before 3.7, the old-style string formatting is equivalent
            # print("%s's (id: %d) final assessment is: %s"%(sdata['name'],\
            # sdata['id'], sdata['assessment'].upper()))
            sdata["name"], sdata["id"],  # sdata['assessment'].upper()))
            print(
                f"{sdata['name']}'s (id: {sdata['id']}) final assessment is:\
            {sdata['assessment'].upper()}"
            )
            sdata["average"] = av


def doubler(x):
    return x * 2


# E
if __name__ == "__main__":
    process_student_data(student_data)
