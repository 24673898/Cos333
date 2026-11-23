### p-2026-exam | prolog | stripPosIncrementNegDuplicateZeros | 2026 Exam Q4 | filter + map
#### spec
Write `stripPosIncrementNegDuplicateZeros(L1, L2)` for simple integer lists. It succeeds if L2 has the elements of L1 in order with **positives removed**, **negatives incremented by 1**, and **zeros duplicated**. Re-querying must not give invalid instantiations.

- `?- stripPosIncrementNegDuplicateZeros([], X).` → `X = []`
- `?- stripPosIncrementNegDuplicateZeros([4, 0, -2], X).` → `X = [0, 0, -1]`
#### hint
One **base fact** + one **rule per kind of head**, and each rule gets a **guard** so only one rule can ever match a given head:

1. `p([], []).`
2. positive: `H > 0` → result is just the processed tail (nothing added).
3. zero: `H = 0` → result head is `[0, 0 | R]`.
4. negative: `H < 0`, `N is H + 1` → result head is `[N | R]`.

The guards (`>`, `=`, `<`) are what stop re-querying from producing wrong answers.
#### solution
```prolog
stripPosIncrementNegDuplicateZeros([], []).
stripPosIncrementNegDuplicateZeros([H|T], R) :-
    H > 0,
    stripPosIncrementNegDuplicateZeros(T, R).
stripPosIncrementNegDuplicateZeros([H|T], [0, 0|R]) :-
    H = 0,
    stripPosIncrementNegDuplicateZeros(T, R).
stripPosIncrementNegDuplicateZeros([H|T], [N|R]) :-
    H < 0,
    N is H + 1,
    stripPosIncrementNegDuplicateZeros(T, R).
```
#### explanation
Prolog has no return value — the "result" is the second parameter, and you **describe its shape in the head of the rule** (`[0, 0|R]`, `[N|R]`). The recursive call fills in `R`. Arithmetic needs `is` (with an uninstantiated variable on the left and everything on the right already known). Because exactly one guard is true for any integer, re-querying (pressing `;` / `r`) just answers `false` — no extra wrong answers.
#### tests
stripPosIncrementNegDuplicateZeros([], X) ==> X = []
stripPosIncrementNegDuplicateZeros([4, 0, -2], X) ==> X = [0, 0, -1]
stripPosIncrementNegDuplicateZeros([1, 2], X) ==> X = []
stripPosIncrementNegDuplicateZeros([0, -1, 0], X) ==> X = [0, 0, 0, 0, 0]
stripPosIncrementNegDuplicateZeros([4, 0, -2], [0, 0, -1]) ==> true
stripPosIncrementNegDuplicateZeros([4], [4]) ==> false
#### attempt 0 / 5
```prolog
stripPosIncrementNegDuplicateZeros (_ , _)
stripPosIncrementNegDuplicateZeros([H|T],[H|Rest]) :-
    stripPosIncrementNegDuplicateZeros(T,Rest) .
stripPosIncrementNegDuplicateZeros([H|T],[H|newtail]) :-
    newtail = h /=2
    stripPosIncrementNegDuplicateZeros(T,newtail) .
...
```
Why it scored 0 (it would not even load):

- **Syntax:** the base case has a space before `(` and no full stop. Several goals are missing the comma between them.
- **`newtail`, `h` are lowercase** → they are *atoms* (constants), not variables. Variables must start with an uppercase letter or `_`.
- **`=` is not assignment** — `X = H + 1` makes X the *term* `H+1`. Use `N is H + 1`.
- **Base case `(_, _)`** matches anything, so it would accept any L2 for any L1.
- **No guards**: the first rule copies every head unchanged, so positives would never be removed.
- The result shapes were wrong: zeros need `[0, 0|R]` and the negative rule put the tail `T` in the head position.

### p-2025-exam | prolog | getNegativesNegatePositives | 2025 Exam Q6 | filter + map
#### spec
Write `getNegativesNegatePositives(L1, L2)` for simple integer lists. L2 has the values of L1 in order where **negatives stay**, **positives are negated**, and **zeros are omitted**.

- `?- getNegativesNegatePositives([0], X).` → `X = []`
- `?- getNegativesNegatePositives([1, 0, -2, 0], X).` → `X = [-1, -2]`
#### hint
Base fact + three guarded rules (`H < 0`, `H > 0`, `H = 0`). Negating: `N is 0 - H` (or `N is -H`).
#### solution
```prolog
getNegativesNegatePositives([], []).
getNegativesNegatePositives([H|T], [H|R]) :-
    H < 0,
    getNegativesNegatePositives(T, R).
getNegativesNegatePositives([H|T], [N|R]) :-
    H > 0,
    N is 0 - H,
    getNegativesNegatePositives(T, R).
getNegativesNegatePositives([H|T], R) :-
    H = 0,
    getNegativesNegatePositives(T, R).
```
#### explanation
"Keep unchanged" means the same `H` appears in both lists (`[H|T]` and `[H|R]`). "Omit" means the output list for that rule is just `R`.
#### tests
getNegativesNegatePositives([0], X) ==> X = []
getNegativesNegatePositives([1, 0, -2, 0], X) ==> X = [-1, -2]
getNegativesNegatePositives([], X) ==> X = []
getNegativesNegatePositives([5, -5], X) ==> X = [-5, -5]

### p-2024-exam | prolog | doublePositives | 2024 Exam | map
#### spec
Write `doublePositives(L1, L2)` for simple integer lists. L2 contains every element of L1 in order, **positives doubled**, non-positives unchanged.

- `?- doublePositives([-4, -9], X).` → `X = [-4, -9]`
- `?- doublePositives([-3, 6, 7, -1, -5], X).` → `X = [-3, 12, 14, -1, -5]`
#### hint
Two guarded rules: `H > 0` (double with `is`) and `H =< 0` (copy). Note Prolog's "less than or equal" is written `=<`, not `<=`.
#### solution
```prolog
doublePositives([], []).
doublePositives([H|T], [D|R]) :-
    H > 0,
    D is H * 2,
    doublePositives(T, R).
doublePositives([H|T], [H|R]) :-
    H =< 0,
    doublePositives(T, R).
```
#### explanation
Without the `H =< 0` guard, re-querying would let a positive value also match the copy rule and produce `[6, ...]` as a second (wrong) answer.
#### tests
doublePositives([-4, -9], X) ==> X = [-4, -9]
doublePositives([-3, 6, 7, -1, -5], X) ==> X = [-3, 12, 14, -1, -5]
doublePositives([], X) ==> X = []

### p-2023-exam | prolog | doubleNonMatching | 2023 Exam | map with a parameter
#### spec
Write `doubleNonMatching(L1, X, L2)` for integer lists and an integer X. L2 has L1's values in order, with every value that does **not** match X doubled; values matching X stay unchanged.

- `?- doubleNonMatching([], 2, X).` → `X = []`
- `?- doubleNonMatching([3, 2, 4, 4, 2], 2, X).` → `X = [6, 2, 8, 8, 2]`
#### hint
Use unification to spot a match: a head written as `[X|T]` with the same variable `X` as the second parameter only matches when they are equal. For the other rule use `not(H = X)`.
#### solution
```prolog
doubleNonMatching([], _, []).
doubleNonMatching([X|T], X, [X|R]) :-
    doubleNonMatching(T, X, R).
doubleNonMatching([H|T], X, [D|R]) :-
    not(H = X),
    D is H * 2,
    doubleNonMatching(T, X, R).
```
#### explanation
Repeating a variable in a head is a compact equality test. `not` succeeds only when its goal cannot be proven, so `not(H = X)` means "H and X don't unify" — fine here because both are already instantiated numbers.
#### tests
doubleNonMatching([], 2, X) ==> X = []
doubleNonMatching([3, 2, 4, 4, 2], 2, X) ==> X = [6, 2, 8, 8, 2]
doubleNonMatching([2, 2], 2, X) ==> X = [2, 2]

### p-2022-exam | prolog | stripOccurrences | 2022 Exam | filter with a parameter
#### spec
Write `stripOccurrences(X, L1, L2)`: L2 contains all the elements of L1, in order, with **all occurrences of X removed**.

- `?- stripOccurrences(a, [b, c, d], X).` → `X = [b, c, d]`
- `?- stripOccurrences(a, [a, b, a, c, a], X).` → `X = [b, c]`
#### hint
Same idea as `doubleNonMatching`: a rule whose head is `[X|T]` handles the match (skip it), a rule with `not(H = X)` handles the rest (keep it).
#### solution
```prolog
stripOccurrences(_, [], []).
stripOccurrences(X, [X|T], R) :-
    stripOccurrences(X, T, R).
stripOccurrences(X, [H|T], [H|R]) :-
    not(H = X),
    stripOccurrences(X, T, R).
```
#### explanation
This is the textbook filter. Without `not(H = X)` the third rule would also accept a matching head, and re-querying would give `[a, b, a, c, a]`-style wrong answers.
#### tests
stripOccurrences(a, [b, c, d], X) ==> X = [b, c, d]
stripOccurrences(a, [a, b, a, c, a], X) ==> X = [b, c]
stripOccurrences(a, [], X) ==> X = []

### p-2026-st2-list | prolog | removeZerosDoubleRest | 2026 Semester Test 2 | filter + map
#### spec
Write `removeZerosDoubleRest(L1, L2)` for integer lists: L2 has L1's elements in order with **zeros removed** and every other value **doubled**.

- `?- removeZerosDoubleRest([0], X).` → `X = []`
- `?- removeZerosDoubleRest([1, 0, -2, 0], X).` → `X = [2, -4]`
#### hint
Base fact, a zero rule (skip) and a non-zero rule (`not(H = 0)`, `D is H * 2`). Lists in rule heads need square brackets: `[H|T]`.
#### solution
```prolog
removeZerosDoubleRest([], []).
removeZerosDoubleRest([H|T], R) :-
    H = 0,
    removeZerosDoubleRest(T, R).
removeZerosDoubleRest([H|T], [D|R]) :-
    not(H = 0),
    D is H * 2,
    removeZerosDoubleRest(T, R).
```
#### explanation
Every element is either skipped or doubled, so two cases are enough. `not(H = 0)` covers both positive and negative values.
#### tests
removeZerosDoubleRest([0], X) ==> X = []
removeZerosDoubleRest([1, 0, -2, 0], X) ==> X = [2, -4]
removeZerosDoubleRest([], X) ==> X = []
#### attempt 0 / 5
```prolog
removeZerosDoubleRest(L1, L2) :-
removeZeroDoubleReset([],_) .
removeZeroDoubleReset(L1,L2)
removeZeroDoubleRest(X|Y,X|L2):-
X=0,
removeZeroDoubleRest(Y,X) .
removeZeroDoubleRest(X|Y,X|L2):-
X\=0,
X = x *2,
removeZeroDoubleRest(Y,X) .
```
Why it scored 0:

- **Three different names** (`removeZerosDoubleRest`, `removeZeroDoubleReset`, `removeZeroDoubleRest`) — Prolog treats them as unrelated predicates. Copy the name from the question.
- **Lists without brackets:** `X|Y` must be `[X|Y]`.
- The zero rule *kept* the zero (`X|L2` in the output) instead of skipping it.
- `X = x * 2` tries to unify X with the term `x*2` (and `x` is an atom). Use a new variable: `D is H * 2`.
- The recursive calls passed `X` (the head) as the result list instead of the tail of the result.
- `\=` is not in the allowed list — use `not(H = 0)`.

### p-2025-st2-list | prolog | getAbsNonZeros | 2025 Semester Test 2 (also Practical 4) | filter + map
#### spec
Write `getAbsNonZeros(L1, L2)`: L2 contains the **absolute values of the non-zero elements** of L1, in order (zeros left out). You may not use the built-in `abs`.

- `?- getAbsNonZeros([0], X).` → `X = []`
- `?- getAbsNonZeros([1, 0, -2, 0], X).` → `X = [1, 2]`
#### hint
Three guarded rules: positive (copy), negative (`A is 0 - H`), zero (skip). Practical 4's `absPositivesNegatives` is the identical problem.
#### solution
```prolog
getAbsNonZeros([], []).
getAbsNonZeros([H|T], [H|R]) :-
    H > 0,
    getAbsNonZeros(T, R).
getAbsNonZeros([H|T], [A|R]) :-
    H < 0,
    A is 0 - H,
    getAbsNonZeros(T, R).
getAbsNonZeros([H|T], R) :-
    H = 0,
    getAbsNonZeros(T, R).
```
#### explanation
Computing |H| yourself: for a negative H, 0 − H is positive.
#### tests
getAbsNonZeros([0], X) ==> X = []
getAbsNonZeros([1, 0, -2, 0], X) ==> X = [1, 2]
getAbsNonZeros([-1, -2, -3], X) ==> X = [1, 2, 3]

### p-2024-st2-list | prolog | countNonMatching | 2024 Semester Test 2 | count
#### spec
Write `countNonMatching(E, L, C)`: C is the number of elements in the atom list L that do **not** match atom E.

- `?- countNonMatching(a, [a, a], X).` → `X = 0`
- `?- countNonMatching(a, [a, b, a, c, d], X).` → `X = 3`
#### hint
Counting in Prolog: recurse **first** to get the count of the tail (`C1`), **then** compute `C is C1 + 1`. (`is` needs the right-hand side fully known.)
#### solution
```prolog
countNonMatching(_, [], 0).
countNonMatching(E, [E|T], C) :-
    countNonMatching(E, T, C).
countNonMatching(E, [H|T], C) :-
    not(H = E),
    countNonMatching(E, T, C1),
    C is C1 + 1.
```
#### explanation
`Sum is Sum + 1` is always wrong in Prolog (a variable can't be re-bound). Use a fresh variable for the tail's result.
#### tests
countNonMatching(a, [a, a], X) ==> X = 0
countNonMatching(a, [a, b, a, c, d], X) ==> X = 3
countNonMatching(a, [], X) ==> X = 0

### p-2023-st2-list | prolog | sumNonNegativeValues | 2023 Semester Test 2 | sum
#### spec
Write `sumNonNegativeValues(L, X)`: X is the sum of all the **non-negative** values (zeros included) in the integer list L.

- `?- sumNonNegativeValues([-1, -2, -3, -5], X).` → `X = 0`
- `?- sumNonNegativeValues([2, -2, 3, -5], X).` → `X = 5`
#### hint
Summing = counting, but add `H` instead of `1`. Guards: `H >= 0` adds, `H < 0` skips.
#### solution
```prolog
sumNonNegativeValues([], 0).
sumNonNegativeValues([H|T], S) :-
    H >= 0,
    sumNonNegativeValues(T, S1),
    S is S1 + H.
sumNonNegativeValues([H|T], S) :-
    H < 0,
    sumNonNegativeValues(T, S).
```
#### explanation
The empty list sums to 0 — that's what makes the arithmetic chain work on the way back out of the recursion.
#### tests
sumNonNegativeValues([-1, -2, -3, -5], X) ==> X = 0
sumNonNegativeValues([2, -2, 3, -5], X) ==> X = 5
sumNonNegativeValues([0, 4], X) ==> X = 4

### p-2022-st2-list | prolog | getPositiveValues | 2022 Semester Test 2 | filter
#### spec
Write `getPositiveValues(L1, L2)`: L2 contains only the positive (non-zero) values of L1.

- `?- getPositiveValues([-1, -2, -3, -5], X).` → `X = []`
- `?- getPositiveValues([1, -2, 3, -5], X).` → `X = [1, 3]`
#### hint
Two guarded rules: `H > 0` keeps, `H =< 0` skips.
#### solution
```prolog
getPositiveValues([], []).
getPositiveValues([H|T], [H|R]) :-
    H > 0,
    getPositiveValues(T, R).
getPositiveValues([H|T], R) :-
    H =< 0,
    getPositiveValues(T, R).
```
#### explanation
The simplest filter — memorise this skeleton.
#### tests
getPositiveValues([-1, -2, -3, -5], X) ==> X = []
getPositiveValues([1, -2, 3, -5], X) ==> X = [1, 3]

### p-prac3-gt | prolog | getValuesGreaterThan | Practical 3 Task 2 | filter with a parameter
#### spec
Write `getValuesGreaterThan(N, L, R)`: R contains only the values of integer list L that are **greater than N**, in order.

- `?- getValuesGreaterThan(5, [], X).` → `X = []`
- `?- getValuesGreaterThan(5, [-1, 4], X).` → `X = []`
- `?- getValuesGreaterThan(5, [-1, 6, 0, 8, -5], X).` → `X = [6, 8]`
#### hint
Guards `H > N` (keep) and `H =< N` (skip). N is passed through unchanged.
#### solution
```prolog
getValuesGreaterThan(_, [], []).
getValuesGreaterThan(N, [H|T], [H|R]) :-
    H > N,
    getValuesGreaterThan(N, T, R).
getValuesGreaterThan(N, [H|T], R) :-
    H =< N,
    getValuesGreaterThan(N, T, R).
```
#### explanation
The practical's hint about **cuts** (`!`): instead of the `H =< N` guard you could put `!` after `H > N` in the keep rule. Guards are clearer and work for re-querying, so prefer them unless asked for a cut.
#### tests
getValuesGreaterThan(5, [], X) ==> X = []
getValuesGreaterThan(5, [-1, 4], X) ==> X = []
getValuesGreaterThan(5, [-1, 6, 0, 8, -5], X) ==> X = [6, 8]

### p-prac3-pairs | prolog | countConsecutivePairs | Practical 3 Task 3 | compare neighbours
#### spec
Write `countConsecutivePairs(L, C)`: C is the number of **consecutive pairs of equal values** in L. A pair is a unit, so `[a, a, a]` has 1 pair and `[a, a, a, a]` has 2.

- `?- countConsecutivePairs([b, a, a, a, c], X).` → `X = 1`
- `?- countConsecutivePairs([b, b, a, c, c, c, d], X).` → `X = 2`
#### hint
Look at the first two elements with the pattern `[X, Y | T]` (from the slides).
- Equal pair `[X, X | T]`: count 1 and continue on `T` (skip both).
- Different `[X, Y | T]` with `not(X = Y)`: continue on `[Y | T]` (drop only one).
- Base cases: `[]` and a single element `[_]` both give 0.
#### solution
```prolog
countConsecutivePairs([], 0).
countConsecutivePairs([_], 0).
countConsecutivePairs([X, X|T], C) :-
    countConsecutivePairs(T, C1),
    C is C1 + 1.
countConsecutivePairs([X, Y|T], C) :-
    not(X = Y),
    countConsecutivePairs([Y|T], C).
```
#### explanation
Skipping both elements after a match is what makes `[a, a, a]` count only one pair. This "two at a time" pattern is also the Prolog version of `monotonicallyIncreasing`.
#### tests
countConsecutivePairs([], X) ==> X = 0
countConsecutivePairs([a, b], X) ==> X = 0
countConsecutivePairs([b, a, a, a, c], X) ==> X = 1
countConsecutivePairs([b, b, a, c, c, c, d], X) ==> X = 2
countConsecutivePairs([a, a, a, a], X) ==> X = 2

### p-2026-st2-facts | prolog | cannotLiveTogether | 2026 Semester Test 2 | facts + rules
#### spec
Using only the supplied facts, write `cannotLiveTogether(X, Y)`: person X cannot live with person Y because X is allergic to an animal **in Y's living space** — a pet Y owns, or a pet owned by the person Y is married to (married people live together).

Expected: john cannot live with samantha, alice or will (cats). samantha cannot live with john, pete or jo (dogs). Nothing else.
#### facts
```prolog
cat(juniper).
cat(tig).
dog(buster).
dog(buck).
pet(juniper, alice).
pet(buster, john).
pet(tig, samantha).
pet(buck, pete).
allergicToCats(john).
allergicToDogs(samantha).
married(will, alice).
married(pete, jo).
```
#### hint
Break it into small helper rules — each is one simple idea:

1. `livesWith(X, Y)` — married in **either direction** (facts only store one direction).
2. `hasCat(P)` — P owns a pet that is a cat. Same for `hasDog`.
3. `catInSpace(P)` — P has a cat, **or** P lives with someone who has a cat. "Or" = two separate rules (you may not use `;`).
4. Two `cannotLiveTogether` rules: one for cat allergy, one for dog allergy.
#### solution
```prolog
livesWith(X, Y) :- married(X, Y).
livesWith(X, Y) :- married(Y, X).

hasCat(P) :- pet(A, P), cat(A).
hasDog(P) :- pet(A, P), dog(A).

catInSpace(P) :- hasCat(P).
catInSpace(P) :- livesWith(P, Q), hasCat(Q).
dogInSpace(P) :- hasDog(P).
dogInSpace(P) :- livesWith(P, Q), hasDog(Q).

cannotLiveTogether(X, Y) :- allergicToCats(X), catInSpace(Y).
cannotLiveTogether(X, Y) :- allergicToDogs(X), dogInSpace(Y).
```
#### explanation
Logical **OR** in Prolog = several rules with the same head. Logical **AND** = commas in one rule body. Symmetric relationships (married) need a helper with both directions. Re-querying `cannotLiveTogether(X, Y)` lists exactly the 6 pairs.
#### tests
cannotLiveTogether(X, Y) ==> X = john, Y = samantha | X = john, Y = alice | X = john, Y = will | X = samantha, Y = john | X = samantha, Y = pete | X = samantha, Y = jo
cannotLiveTogether(john, pete) ==> false
cannotLiveTogether(samantha, will) ==> false
#### attempt 0 / 5
```prolog
cannotLiveTogether(X, Y):-
together(X,Q):- married(X, Q); married(Q, X),
X /=Q ,
pet(Z ,X).
notCatPerson(X,Y):-
allergicToCats(X),
cat(Z),
pet(Z ,Y).
notDogPerson(X,Y):-
allergicToCats(X),
dog(Z),
pet(Z ,Y).
```
Why it scored 0:

- **A rule inside a rule:** `cannotLiveTogether(X,Y) :- together(X,Q) :- ...` is a syntax error. Each rule is its own clause ending in `.`.
- **`;` was not allowed** (and `/=` isn't Prolog — inequality would be `not(X = Q)`). Use two separate rules for "or".
- `cannotLiveTogether` never used `notCatPerson`/`notDogPerson`, so even if it loaded nothing would connect.
- `notDogPerson` tests `allergicToCats` (copy-paste bug) — should be `allergicToDogs`.
- The married partner's pets were never considered (will and jo cases).

Your helper idea (`notCatPerson` = allergic + cat + pet) was actually on the right track — it just needed the "lives with" case and a top-level rule that calls it.

### p-2025-st2-facts | prolog | nephewNiece | 2025 Semester Test 2 | facts + rules
#### spec
Using only `father` and `mother` facts, write `nephewNiece(X, Y)`: X is the nephew or niece of Y (X is a child of Y's brother or sister). Siblings share at least one parent. Single and same-sex parents are possible, so don't assume everyone has both a mother and a father.

Expected: ted is the nephew of shelley; liz is the niece of jake. Nothing else.
#### facts
```prolog
father(bill, jake).
father(bill, shelley).
father(jake, ted).
father(ron, liz).
mother(mary, jake).
mother(mary, shelley).
mother(janet, ted).
mother(shelley, liz).
```
#### hint
Build up from small rules (the slides' `parent`/`sibling` pattern):

1. `parent/2` = father OR mother (two rules).
2. `sibling(X, Y)` = share a parent AND `not(X = Y)` (otherwise everyone is their own sibling — the slides' "negation problem" example).
3. `nephewNiece(X, Y)` = some parent P of X is a sibling of Y.
#### solution
```prolog
parent(X, Y) :- father(X, Y).
parent(X, Y) :- mother(X, Y).

sibling(X, Y) :- parent(P, X), parent(P, Y), not(X = Y).

nephewNiece(X, Y) :- parent(P, X), sibling(P, Y).
```
#### explanation
Each answer appears **twice** on re-query because jake and shelley share two parents (bill and mary), so `sibling` can be proven two ways. That's a repeated *valid* answer, not an invalid instantiation. Without `not(X = Y)` you'd also get ted as his own father's "nephew" via `sibling(jake, jake)`.
#### tests
nephewNiece(X, Y) ==> X = ted, Y = shelley | X = liz, Y = jake
nephewNiece(ted, jake) ==> false
nephewNiece(liz, shelley) ==> false

### p-2024-st2-facts | prolog | ownsSharedProperty | 2024 Semester Test 2 | facts + rules
#### spec
Using the `tenant(X, Y)` (X rents from owner Y) and `address(X, A)` facts, write `ownsSharedProperty(X)`: X owns a property rented by **two different tenants with the same address**.

Expected: only jane (tom and mary both rent from jane and both live at shillingLane15). tony is **not** an answer: alice and jonathan share an address but jonathan is not tony's tenant.
#### facts
```prolog
tenant(alice, tony).
tenant(tom, jane).
tenant(joe, tony).
tenant(mary, jane).
address(alice, pineStreet12).
address(tom, shillingLane15).
address(joe, duncanRoad6).
address(mary, shillingLane15).
address(jonathan, pineStreet12).
```
#### hint
Find two tenants A and B of the same owner X, insist they are different people (`not(A = B)`), and that their addresses unify.
#### solution
```prolog
ownsSharedProperty(X) :-
    tenant(A, X),
    tenant(B, X),
    not(A = B),
    address(A, Addr),
    address(B, Addr).
```
#### explanation
Using the **same variable** `Addr` in both `address` goals is how you say "same address". Order the subgoals so variables are instantiated before `not` is used (`not` with unbound variables behaves differently). jane appears twice on re-query (A = tom, B = mary and A = mary, B = tom) — repeated valid answers.
#### tests
ownsSharedProperty(X) ==> X = jane
ownsSharedProperty(tony) ==> false

### p-2023-st2-facts | prolog | cousin | 2023 Semester Test 2 | facts + rules
#### spec
Using `father`/`mother` facts, write `cousin(X, Y)`: X and Y have parents who are siblings. Single and same-sex parents are possible.

Expected: only ted and alice are cousins (both directions).
#### facts
```prolog
father(joe, jane).
father(joe, dan).
father(bill, ted).
father(dan, alice).
mother(mary, jane).
mother(mary, dan).
mother(jane, ted).
mother(linda, alice).
```
#### hint
Reuse `parent` and `sibling` from the nephew/niece question, then: a parent of X is a sibling of a parent of Y.
#### solution
```prolog
parent(X, Y) :- father(X, Y).
parent(X, Y) :- mother(X, Y).

sibling(X, Y) :- parent(P, X), parent(P, Y), not(X = Y).

cousin(X, Y) :- parent(PX, X), parent(PY, Y), sibling(PX, PY).
```
#### explanation
Family questions appear in almost every Semester Test 2. Learn `parent` + `sibling` by heart and every relationship (uncle/aunt, cousin, nephew/niece, grandparent) is one more line.
#### tests
cousin(X, Y) ==> X = ted, Y = alice | X = alice, Y = ted
cousin(ted, dan) ==> false

### p-2022-st2-facts | prolog | uncleAunt | 2022 Semester Test 2 | facts + rules
#### spec
Using `father`/`mother` facts, write `uncleAunt(X, Y)`: X is the sibling of a parent of Y.

Expected: `uncleAunt(jake, liz)` and `uncleAunt(shelley, ted)` only.
#### facts
```prolog
father(bill, jake).
father(bill, shelley).
father(jake, ted).
father(ron, liz).
mother(mary, jake).
mother(mary, shelley).
mother(janet, ted).
mother(shelley, liz).
```
#### hint
`uncleAunt` is just `nephewNiece` with the arguments swapped.
#### solution
```prolog
parent(X, Y) :- father(X, Y).
parent(X, Y) :- mother(X, Y).

sibling(X, Y) :- parent(P, X), parent(P, Y), not(X = Y).

uncleAunt(X, Y) :- parent(P, Y), sibling(X, P).
```
#### explanation
Compare with `nephewNiece(X, Y) :- parent(P, X), sibling(P, Y).` — the relationships are inverses.
#### tests
uncleAunt(X, Y) ==> X = jake, Y = liz | X = shelley, Y = ted

### p-prac3-network | prolog | computersConnected | Practical 3 Task 1 | facts + rules
#### spec
Using only the `computer`, `router` and `connection` facts (connections work in both directions but only one direction is stored), define:

- `routersConnected(X, Y)` — routers connected directly or through one other router (bidirectional).
- `computerConnectedToRouter(X, Y)` — computer X is linked to router Y.
- `computersConnected(X, Y)` — computers connected directly, or via routers.
#### facts
```prolog
computer(pc1).
computer(pc2).
computer(pc3).
computer(pc4).
computer(pc5).
computer(pc6).
router(router1).
router(router2).
router(router3).
connection(pc1, router1).
connection(router1, pc2).
connection(router1, router2).
connection(router3, router2).
connection(router2, pc3).
connection(pc4, router3).
connection(pc5, pc6).
```
#### hint
Start with a symmetric `link(X, Y)` helper (two rules). Then: routers directly linked, or linked through a third router Z (and not the same router). Computers: directly linked, on the same router, or on routers that are connected.
#### solution
```prolog
link(X, Y) :- connection(X, Y).
link(X, Y) :- connection(Y, X).

routersConnected(X, Y) :- router(X), router(Y), link(X, Y).
routersConnected(X, Y) :-
    router(X), router(Y), router(Z),
    link(X, Z), link(Z, Y), not(X = Y).

computerConnectedToRouter(X, Y) :- computer(X), router(Y), link(X, Y).

computersConnected(X, Y) :- computer(X), computer(Y), link(X, Y).
computersConnected(X, Y) :-
    computerConnectedToRouter(X, R),
    computerConnectedToRouter(Y, R),
    not(X = Y).
computersConnected(X, Y) :-
    computerConnectedToRouter(X, R1),
    computerConnectedToRouter(Y, R2),
    routersConnected(R1, R2).
```
#### explanation
Practical hint 1: testing **false** queries matters as much as true ones — an over-general rule (e.g. forgetting `not(X = Y)`) makes `computersConnected(pc1, pc1)` true.
#### tests
routersConnected(router1, router3) ==> true
routersConnected(router3, router1) ==> true
computersConnected(pc1, pc4) ==> true
computersConnected(pc4, pc1) ==> true
computersConnected(pc5, pc6) ==> true
computersConnected(pc1, pc5) ==> false
computersConnected(pc1, pc1) ==> false
computerConnectedToRouter(pc3, X) ==> X = router2

### p-slides-core | prolog | member / append / reverse | Slides (know by heart) | core
#### spec
Write the three list propositions from the slides yourself (the built-in versions are **banned** in tests and exams):

- `myMember(E, L)` — E is in L.
- `myAppend(L1, L2, L3)` — L3 is L2 appended to L1.
- `myReverse(L, R)` — R is L reversed.
#### hint
- member: E is the head, OR E is a member of the tail.
- append: appending to `[]` gives the second list; otherwise keep the head and append the tail.
- reverse: reverse the tail, then append the head (as a one-element list) at the end.
#### solution
```prolog
myMember(E, [E|_]).
myMember(E, [_|T]) :- myMember(E, T).

myAppend([], L, L).
myAppend([H|T1], L2, [H|T3]) :- myAppend(T1, L2, T3).

myReverse([], []).
myReverse([H|T], R) :- myReverse(T, RT), myAppend(RT, [H], R).
```
#### explanation
Rename them (`myMember`) so they don't clash with SWI-Prolog's built-ins. `_` is the anonymous variable — use it for values you don't need. Note `myAppend` works "backwards" too: `myAppend(X, [c, d], [a, b, c, d])` finds `X = [a, b]`.
#### tests
myMember(b, [a, b, c]) ==> true
myMember(z, [a, b, c]) ==> false
myAppend([a, b], [c, d], X) ==> X = [a, b, c, d]
myAppend(X, [c, d], [a, b, c, d]) ==> X = [a, b]
myReverse([a, b, c], X) ==> X = [c, b, a]

### p-new-increasing | prolog | monotonicallyIncreasing | New practice (Prolog version of 2026 Scheme Q) | compare neighbours
#### spec
Write `monotonicallyIncreasing(L)`: succeeds if every number in L is **greater than or equal to** the previous one. Lists with fewer than two values succeed.

- `?- monotonicallyIncreasing([2, 3, 5, 5, 6]).` → `true`
- `?- monotonicallyIncreasing([2, 4, 1]).` → `false`
#### hint
Base facts for `[]` and `[_]`. Recursive rule with head `[X, Y|T]`: require `X =< Y` and recurse on `[Y|T]`. You never write a "false" case — Prolog fails automatically when no rule matches.
#### solution
```prolog
monotonicallyIncreasing([]).
monotonicallyIncreasing([_]).
monotonicallyIncreasing([X, Y|T]) :-
    X =< Y,
    monotonicallyIncreasing([Y|T]).
```
#### explanation
Slides: "We also don't specify negative (false) cases" — closed-world assumption: anything not provable is false.
#### tests
monotonicallyIncreasing([]) ==> true
monotonicallyIncreasing([5]) ==> true
monotonicallyIncreasing([2, 3, 5, 5, 6]) ==> true
monotonicallyIncreasing([2, 4, 1, 5, 7]) ==> false

### p-new-count-neg | prolog | countNegatives | New practice | count
#### spec
Write `countNegatives(L, C)`: C is the number of negative values in integer list L.

- `?- countNegatives([3, -1, 0, -7], X).` → `X = 2`
#### hint
Counting skeleton with guards `H < 0` (count) and `H >= 0` (skip).
#### solution
```prolog
countNegatives([], 0).
countNegatives([H|T], C) :-
    H < 0,
    countNegatives(T, C1),
    C is C1 + 1.
countNegatives([H|T], C) :-
    H >= 0,
    countNegatives(T, C).
```
#### explanation
Always ask: "if I re-query, could a value fall into two rules?" Complementary guards (`<` / `>=`) make the answer no.
#### tests
countNegatives([], X) ==> X = 0
countNegatives([3, -1, 0, -7], X) ==> X = 2

### p-new-second | prolog | doubleEverySecond | New practice (Prolog version of Practical 2 Task 3) | position-based
#### spec
Write `doubleEverySecond(L1, L2)`: L2 contains only the doubles of every second element of L1.

- `?- doubleEverySecond([4, 6, 2, 3], X).` → `X = [12, 6]`
- `?- doubleEverySecond([4], X).` → `X = []`
#### hint
Pattern `[_, Y|T]` grabs the second element and drops both.
#### solution
```prolog
doubleEverySecond([], []).
doubleEverySecond([_], []).
doubleEverySecond([_, Y|T], [D|R]) :-
    D is Y * 2,
    doubleEverySecond(T, R).
```
#### explanation
No guards needed — the three heads match lists of length 0, 1 and ≥2, so they can never overlap.
#### tests
doubleEverySecond([], X) ==> X = []
doubleEverySecond([4], X) ==> X = []
doubleEverySecond([4, 6, 2, 3], X) ==> X = [12, 6]
doubleEverySecond([1, 2, 3, 4, 5], X) ==> X = [4, 8]

### p-new-dedupe | prolog | removeAdjacentDuplicates | New practice | compare neighbours
#### spec
Write `removeAdjacentDuplicates(L1, L2)`: L2 is L1 with runs of equal neighbouring values collapsed to one.

- `?- removeAdjacentDuplicates([a, a, b, b, b, a], X).` → `X = [a, b, a]`
#### hint
Base facts for `[]` and `[X]`. If the first two are equal, drop the first and recurse on `[X|T]`. If different, keep the first.
#### solution
```prolog
removeAdjacentDuplicates([], []).
removeAdjacentDuplicates([X], [X]).
removeAdjacentDuplicates([X, X|T], R) :-
    removeAdjacentDuplicates([X|T], R).
removeAdjacentDuplicates([X, Y|T], [X|R]) :-
    not(X = Y),
    removeAdjacentDuplicates([Y|T], R).
```
#### explanation
Unlike `countConsecutivePairs`, here we only drop ONE element after a match so longer runs collapse fully.
#### tests
removeAdjacentDuplicates([], X) ==> X = []
removeAdjacentDuplicates([a, a, b, b, b, a], X) ==> X = [a, b, a]
removeAdjacentDuplicates([1, 2, 3], X) ==> X = [1, 2, 3]
