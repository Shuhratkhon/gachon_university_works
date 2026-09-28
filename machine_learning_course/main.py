import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix

# PROBLEM STATEMENT
# predict whether an email is Spam (1) or Not Spam (0) from its simple details

rng = np.random.default_rng(42)
n = 500
is_spam = rng.integers(0, 2, n)  # hidden true label used to generate data

data = pd.DataFrame({
    "num_links": np.where(is_spam == 1, rng.poisson(6, n), rng.poisson(1.5, n)),
    "num_words": np.where(is_spam == 1, rng.normal(80, 30, n), rng.normal(150, 50, n)).clip(10).astype(int),
    "num_capitals": np.where(is_spam == 1, rng.poisson(25, n), rng.poisson(8, n)),
    "has_promo_words": np.where(is_spam == 1, rng.binomial(1, 0.85, n), rng.binomial(1, 0.15, n)),
    "spam": is_spam,
})

# variables used as inputs
X = data[["num_links", "num_words", "num_capitals", "has_promo_words"]]

# classes:
y = data["spam"]

# splitting into training (80%) and testing (20%) sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# create and train logistic regression model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# predict on the set
y_pred = model.predict(X_test)

# Accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2%}")

# CONFUSION MATRIX (rows = real, columns = predicted)
cm = confusion_matrix(y_test, y_pred)
print("\nConfusion Matrix:")
print(pd.DataFrame(cm,
                   index=["Actual Not Spam", "Actual Spam"],
                   columns=["Pred Not Spam", "Pred Spam"]))

# 5 predicted examples
examples = X_test.head(6).copy()
examples["Actual"] = y_test.head(6).map({0: "Not Spam", 1: "Spam"})
examples["Predicted"] = pd.Series(y_pred, index=y_test.index).head(6).map({0: "Not Spam", 1: "Spam"})
print("\nSample predictions:")
print(examples.to_string())

# Visuals:

# heatmap:
fig, axes = plt.subplots(1, 2, figsize=(11, 4.5))

ax = axes[0]
ax.imshow(cm, cmap="Blues")
ax.set_xticks([0, 1], ["Not Spam", "Spam"])
ax.set_yticks([0, 1], ["Not Spam", "Spam"])
ax.set_xlabel("Predicted")
ax.set_ylabel("Actual")
ax.set_title(f"Confusion Matrix (Accuracy: {accuracy:.0%})")
for i in range(2):
    for j in range(2):
        ax.text(j, i, cm[i, j], ha="center", va="center", fontsize=16,
                color="white" if cm[i, j] > cm.max() / 2 else "black")

# which features push an email toward Spam (positive) or Not Spam (negative)
ax = axes[1]
coefs = pd.Series(model.coef_[0], index=X.columns).sort_values()
ax.barh(coefs.index, coefs.values,
        color=["tab:red" if v > 0 else "tab:green" for v in coefs.values])
ax.axvline(0, color="black", linewidth=0.8)
ax.set_title("Feature Influence (red = towards Spam)")
ax.set_xlabel("Model coefficient")

plt.tight_layout()
plt.savefig("spam_results.png", dpi=150)
plt.show()

# EXPLANATION:
# The model was trained on 400 emails and tested on 100 unseen emails.
# The accuracy shows how many test emails it classified correctly, and the
# confusion matrix shows where the mistakes were (false alarms vs missed spam)

