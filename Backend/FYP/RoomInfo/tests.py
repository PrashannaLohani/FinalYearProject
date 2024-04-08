from django.test import TestCase

# Create your tests here.
obj = {
    "1": "a",
  1: "b",
  [1]: "c",
}
print(obj["1"])