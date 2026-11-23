### s-2026-exam | scheme | monotonicallyIncreasing | 2026 Exam Q3 | compare neighbours
#### spec
Write `monotonicallyIncreasing`, applied to a simple numeric list `lis`. Yield `#t` if every number is **greater than or equal to** the one before it (left to right), otherwise `#f`. A list with fewer than two values counts as monotonically increasing.

- `(monotonicallyIncreasing '())` → `#t`
- `(monotonicallyIncreasing '(5))` → `#t`
- `(monotonicallyIncreasing '(2 3 5 5 6))` → `#t` (5 then 5 is allowed)
- `(monotonicallyIncreasing '(2 4 1 5 7))` → `#f` (1 < 4)
#### hint
This is a **compare-neighbours** question: you always look at the first TWO elements.

1. Two base cases: empty list → `#t`; one element left (`(null? (cdr lis))`) → `#t`. You need the second one, otherwise `(car (cdr lis))` crashes on a 1-element list.
2. If the first is **greater than** the second, the sequence is broken → `#f`.
3. Otherwise recurse on `(cdr lis)` (drop only ONE element so every neighbouring pair is checked).
#### solution
```scheme
(define (monotonicallyIncreasing lis)
  (cond
    ((null? lis) #t)
    ((null? (cdr lis)) #t)
    ((> (car lis) (car (cdr lis))) #f)
    (else (monotonicallyIncreasing (cdr lis)))))
```
#### explanation
Test the failure condition (`>`), not the success condition — that way equal neighbours (`5 5`) automatically fall through to `else` and keep going. Each recursive call drops one element, so pairs (2,3), (3,5), (5,5), (5,6) are all compared. The result of the whole function is simply whatever the last recursive call returns (a tail call).
#### tests
(monotonicallyIncreasing '()) ==> #t
(monotonicallyIncreasing '(5)) ==> #t
(monotonicallyIncreasing '(2 3 5 5 6)) ==> #t
(monotonicallyIncreasing '(2 4 1 5 7)) ==> #f
(monotonicallyIncreasing '(3 2)) ==> #f
(monotonicallyIncreasing '(-4 -4 0 9)) ==> #t
(monotonicallyIncreasing '(1 2 3 2)) ==> #f
#### attempt 2.5 / 5
```scheme
(define(monotonicallyIncreasing lis)
  (cond
    ((null? lis) #true)
    ((< (car lis) (car(cdr lis)))
     ((monotonicallyIncreasing (cdr lis))))
    (else false)))
```
What cost marks (marked by functionality tests):

- **No one-element base case.** `'(5)` reaches `(car (cdr lis))` = `(car '())` → error. So `'(5)` and every list that is still increasing when it reaches its last element (like `'(2 3 5 5 6)`) blew up.
- **`<` instead of `>=` logic.** Equal neighbours (`5 5`) went to `else` and returned false, but the spec says equal is allowed.
- **Extra parentheses** around the recursive call: `((monotonicallyIncreasing (cdr lis)))` tries to *call the result* (`#t`/`#f`) as a function → error.
- `#true` and `false` happen to work in Racket but aren't in the allowed list — use `#t` and `#f`.

### s-2025-exam | scheme | getZerosDoublePositives | 2025 Exam Q5 | filter + map
#### spec
Write `getZerosDoublePositives`, applied to a simple numeric list `lst`. Yield a list of the values in order, where **zeros stay**, **positives are doubled**, and **negatives are omitted**.

- `(getZerosDoublePositives '())` → `()`
- `(getZerosDoublePositives '(-5))` → `()`
- `(getZerosDoublePositives '(-1 4 0 -3 12))` → `(8 0 24)`
#### hint
One `cond` clause per kind of head value: empty, zero, positive, negative.

- Keep: `(cons (car lst) (recurse))`
- Change: `(cons (* 2 (car lst)) (recurse))`
- Drop: just `(recurse)` — don't cons anything.
#### solution
```scheme
(define (getZerosDoublePositives lst)
  (cond
    ((null? lst) '())
    ((zero? (car lst))
     (cons (car lst) (getZerosDoublePositives (cdr lst))))
    ((positive? (car lst))
     (cons (* 2 (car lst)) (getZerosDoublePositives (cdr lst))))
    (else (getZerosDoublePositives (cdr lst)))))
```
#### explanation
The "build a new list" pattern from `append`: the recursive call builds the rest of the result, and `cons` puts the (possibly transformed) head on the front. Omitting a value = returning the recursive result without a `cons`. Order is preserved because we `cons` the head before the processed tail.
#### tests
(getZerosDoublePositives '()) ==> ()
(getZerosDoublePositives '(-5)) ==> ()
(getZerosDoublePositives '(-1 4 0 -3 12)) ==> (8 0 24)
(getZerosDoublePositives '(0 0)) ==> (0 0)
(getZerosDoublePositives '(3)) ==> (6)

### s-2024-exam | scheme | removePositiveOddValues | 2024 Exam | filter
#### spec
Write `removePositiveOddValues`, applied to a simple numeric list. Yield the values in their original order with all **positive odd** values removed.

- `(removePositiveOddValues '(3 9))` → `()`
- `(removePositiveOddValues '(-5 3 0 5 9))` → `(-5 0)` (−5 is odd but not positive, so it stays)
#### hint
Remove = skip the head (no `cons`). The condition to skip is `(and (positive? x) (odd? x))`. Everything else is kept.
#### solution
```scheme
(define (removePositiveOddValues lis)
  (cond
    ((null? lis) '())
    ((and (positive? (car lis)) (odd? (car lis)))
     (removePositiveOddValues (cdr lis)))
    (else (cons (car lis) (removePositiveOddValues (cdr lis))))))
```
#### explanation
A pure filter. `and` is allowed (logical predicates: `and`, `or`, `not`). Watch the trap value: −5 is odd and must be kept, so you can't test `odd?` alone.
#### tests
(removePositiveOddValues '()) ==> ()
(removePositiveOddValues '(3 9)) ==> ()
(removePositiveOddValues '(-5 3 0 5 9)) ==> (-5 0)
(removePositiveOddValues '(2 4 -7)) ==> (2 4 -7)

### s-2023-exam | scheme | doublePositives | 2023 Exam | map
#### spec
Write `doublePositives`, applied to a simple numeric list. Yield a list with the same values, where **positive values are doubled**; negative and zero values stay unchanged.

- `(doublePositives '())` → `()`
- `(doublePositives '(2 -4 7 -3))` → `(4 -4 14 -3)`
#### hint
Every element is kept (it's a map), only the value consed changes. Two non-empty cases: positive → `(* 2 x)`, otherwise → `x`.
#### solution
```scheme
(define (doublePositives lis)
  (cond
    ((null? lis) '())
    ((positive? (car lis))
     (cons (* 2 (car lis)) (doublePositives (cdr lis))))
    (else (cons (car lis) (doublePositives (cdr lis))))))
```
#### explanation
This is the slides' `mapcar` idea specialised: apply a transformation to each element and rebuild the list with `cons`. The output always has the same length as the input.
#### tests
(doublePositives '()) ==> ()
(doublePositives '(2 -4 7 -3)) ==> (4 -4 14 -3)
(doublePositives '(0)) ==> (0)

### s-2022-exam | scheme | getPositiveOddValues | 2022 Exam | filter
#### spec
Write `getPositiveOddValues`, applied to a simple numeric list. Yield a list of only the **positive (non-zero) odd** values.

- `(getPositiveOddValues '())` → `()`
- `(getPositiveOddValues '(1 2 7 -3 4))` → `(1 7)`
#### hint
Keep the head only when `(and (positive? x) (odd? x))`; otherwise skip it.
#### solution
```scheme
(define (getPositiveOddValues lis)
  (cond
    ((null? lis) '())
    ((and (positive? (car lis)) (odd? (car lis)))
     (cons (car lis) (getPositiveOddValues (cdr lis))))
    (else (getPositiveOddValues (cdr lis)))))
```
#### explanation
The mirror image of `removePositiveOddValues`: same test, but here the matching values are kept and everything else skipped.
#### tests
(getPositiveOddValues '()) ==> ()
(getPositiveOddValues '(1 2 7 -3 4)) ==> (1 7)
(getPositiveOddValues '(-1 0 2)) ==> ()

### s-2026-st1-list | scheme | doublePositivesAbsNegatives | 2026 Semester Test 1 | filter + map
#### spec
Write `doublePositivesAbsNegatives`, applied to a simple numeric list `lis`. Yield the values in order where **positives are doubled**, **negatives become their absolute value**, and **zeros are omitted**.

- `'()` → `()`
- `'(0)` → `()`
- `'(2 -2 0 3)` → `(4 2 6)`
#### hint
Four `cond` clauses: `null?`, `zero?` (skip), `positive?` (cons double), `else` (cons `abs`).

Syntax checklist: the function name goes **inside** the parentheses — `(car lis)`, not `car(lis)`; `cond` must itself be wrapped: `(cond (test expr) ...)`.
#### solution
```scheme
(define (doublePositivesAbsNegatives lis)
  (cond
    ((null? lis) '())
    ((zero? (car lis)) (doublePositivesAbsNegatives (cdr lis)))
    ((positive? (car lis))
     (cons (* 2 (car lis)) (doublePositivesAbsNegatives (cdr lis))))
    (else
     (cons (abs (car lis)) (doublePositivesAbsNegatives (cdr lis))))))
```
#### explanation
Same shape as every "transform some, omit some" question. Once zeros and positives are handled, the only values left in `else` are negatives — no need to test `negative?` explicitly.
#### tests
(doublePositivesAbsNegatives '()) ==> ()
(doublePositivesAbsNegatives '(0)) ==> ()
(doublePositivesAbsNegatives '(2 -2 0 3)) ==> (4 2 6)
(doublePositivesAbsNegatives '(-7 0 0 1)) ==> (7 2)
#### attempt 0 / 5
```scheme
(define (doublePositivesAbsNegatives lis )
  (if(list? lis) '()
     cond(
          (car(lis) = 0)
          ...
```
Why it scored 0:

- `(if (list? lis) '() ...)` returns `()` for **every** list, because the parameter is always a list. You meant `(null? lis)`.
- C-style calls: `car(lis)`, `cond(`, `abs(car(lis))`. In Scheme the operator goes first **inside** the parentheses: `(car lis)`, `(abs (car lis))`.
- Infix `(car(lis) = 0)` — must be prefix: `(= (car lis) 0)` or `(zero? (car lis))`.
- The recursive calls passed `lis` again instead of `(cdr lis)`, which would loop forever.
- Nothing was `cons`ed, so no result list was ever built.
- Typo `negatuve?`.

### s-2025-st1-list | scheme | countDivisors | 2025 Semester Test 1 | count
#### spec
Write `countDivisors`, applied to a number `atm` and a simple numeric list `lst`. Yield how many values in `lst` are **divisors** of `atm` (divide into it perfectly).

- `(countDivisors 6 '())` → `0`
- `(countDivisors 6 '(4 12))` → `0`
- `(countDivisors 6 '(1 4 3 12))` → `2`
#### hint
Counting pattern: base case yields `0`; a match yields `(+ 1 (recurse))`; no match yields just `(recurse)`.
"x is a divisor of atm" ⇔ `(= (remainder atm x) 0)` (or `(zero? (remainder atm x))`).
#### solution
```scheme
(define (countDivisors atm lst)
  (cond
    ((null? lst) 0)
    ((zero? (remainder atm (car lst)))
     (+ 1 (countDivisors atm (cdr lst))))
    (else (countDivisors atm (cdr lst)))))
```
#### explanation
`atm` is passed unchanged on every recursive call; only the list shrinks. Note the argument order of `remainder`: `(remainder atm x)` asks "what is left when atm is divided by x".
#### tests
(countDivisors 6 '()) ==> 0
(countDivisors 6 '(4 12)) ==> 0
(countDivisors 6 '(1 4 3 12)) ==> 2
(countDivisors 12 '(1 2 3 4 5 6)) ==> 5

### s-2024-st1-list | scheme | duplicateNonMatchingValues | 2024 Semester Test 1 | expand
#### spec
Write `duplicateNonMatchingValues`, applied to a simple list of atoms and an atom. Yield the list in order, with every value that does **not** match the atom **duplicated**.

- `(duplicateNonMatchingValues '() 'A)` → `()`
- `(duplicateNonMatchingValues '(A D A C B) 'A)` → `(A D D A C C B B)`
#### hint
Compare atoms with `eqv?`. To duplicate, `cons` the head **twice**: `(cons x (cons x (recurse)))`.
#### solution
```scheme
(define (duplicateNonMatchingValues lis atm)
  (cond
    ((null? lis) '())
    ((eqv? (car lis) atm)
     (cons (car lis) (duplicateNonMatchingValues (cdr lis) atm)))
    (else
     (cons (car lis)
           (cons (car lis) (duplicateNonMatchingValues (cdr lis) atm))))))
```
#### explanation
`eqv?` works for both symbols and numbers (slides: prefer `eqv?` over `eq?`). Nested `cons` builds two cells for one input element.
#### tests
(duplicateNonMatchingValues '() 'A) ==> ()
(duplicateNonMatchingValues '(A D A C B) 'A) ==> (A D D A C C B B)
(duplicateNonMatchingValues '(A A) 'A) ==> (A A)

### s-2023-st1-list | scheme | countNonMatchingValues | 2023 Semester Test 1 | count
#### spec
Write `countNonMatchingValues`, applied to a simple list and an atom. Yield the number of atoms in the list that do **not** match the atom.

- `(countNonMatchingValues '() 'A)` → `0`
- `(countNonMatchingValues '(A B A C D) 'A)` → `3`
#### hint
Counting pattern with `eqv?`. Use `(not (eqv? ...))` or put the match case first and count in `else`.
#### solution
```scheme
(define (countNonMatchingValues lis atm)
  (cond
    ((null? lis) 0)
    ((eqv? (car lis) atm) (countNonMatchingValues (cdr lis) atm))
    (else (+ 1 (countNonMatchingValues (cdr lis) atm)))))
```
#### explanation
Matching values contribute nothing; every other value adds 1 to the count of the rest.
#### tests
(countNonMatchingValues '() 'A) ==> 0
(countNonMatchingValues '(A B A C D) 'A) ==> 3
(countNonMatchingValues '(A A) 'A) ==> 0

### s-2022-st1-list | scheme | countPositiveEvenNumbers | 2022 Semester Test 1 | count
#### spec
Write `countPositiveEvenNumbers`, applied to a simple numeric list. Yield the number of **positive (non-zero) even** values.

- `'()` → `0`
- `'(-2 4 0 5 8 3)` → `2`
#### hint
Zero is even but not positive — `(and (positive? x) (even? x))` excludes it.
#### solution
```scheme
(define (countPositiveEvenNumbers lis)
  (cond
    ((null? lis) 0)
    ((and (positive? (car lis)) (even? (car lis)))
     (+ 1 (countPositiveEvenNumbers (cdr lis))))
    (else (countPositiveEvenNumbers (cdr lis)))))
```
#### explanation
Same counting skeleton as `countDivisors`. The traps in the example are −2 (even, not positive) and 0 (even, not positive).
#### tests
(countPositiveEvenNumbers '()) ==> 0
(countPositiveEvenNumbers '(-2 4 0 5 8 3)) ==> 2

### s-prac4 | scheme | sumAbsNegativeFracPositivesCountZeros | Practical 4 | sum
#### spec
Write `sumAbsNegativeFracPositivesCountZeros`, applied to a simple numeric list. Yield the **sum** of converted values: a negative value counts as its **absolute value**, a positive value `v` counts as **1 ÷ v** (with a decimal point), and a zero counts as **1**.

- `'()` → `0`
- `'(2 4)` → `0.75`
- `'(-2 -4)` → `6`
- `'(0 2 -4)` → `5.5`
#### hint
Summing pattern: base case `0`, each case is `(+ converted (recurse))`.
To force a decimal result use `(/ 1.0 x)` — `(/ 1 2)` would give the exact fraction `1/2`.
#### solution
```scheme
(define (sumAbsNegativeFracPositivesCountZeros lis)
  (cond
    ((null? lis) 0)
    ((zero? (car lis))
     (+ 1 (sumAbsNegativeFracPositivesCountZeros (cdr lis))))
    ((positive? (car lis))
     (+ (/ 1.0 (car lis)) (sumAbsNegativeFracPositivesCountZeros (cdr lis))))
    (else
     (+ (abs (car lis)) (sumAbsNegativeFracPositivesCountZeros (cdr lis))))))
```
#### explanation
Scheme has exact rationals: `(/ 1 4)` is `1/4`, not `0.25`. Using the float literal `1.0` makes the division inexact so the answer prints with a decimal point.
#### tests
(sumAbsNegativeFracPositivesCountZeros '()) ==> 0
(sumAbsNegativeFracPositivesCountZeros '(2 4)) ==> 0.75
(sumAbsNegativeFracPositivesCountZeros '(-2 -4)) ==> 6
(sumAbsNegativeFracPositivesCountZeros '(0 2 -4)) ==> 5.5

### s-prac2-count | scheme | countNonZeroValues | Practical 2 Task 2 | count
#### spec
Write `countNonZeroValues`, applied to a simple list of integers. Yield how many values are **non-zero**.

- `'()` → `0`
- `'(0 0)` → `0`
- `'(3 0 -8 0)` → `2`
#### hint
Skip zeros, add 1 for everything else.
#### solution
```scheme
(define (countNonZeroValues lis)
  (cond
    ((null? lis) 0)
    ((zero? (car lis)) (countNonZeroValues (cdr lis)))
    (else (+ 1 (countNonZeroValues (cdr lis))))))
```
#### explanation
The practical asked you to do it as a single function — this is it.
#### tests
(countNonZeroValues '()) ==> 0
(countNonZeroValues '(0 0)) ==> 0
(countNonZeroValues '(3 0 -8 0)) ==> 2

### s-prac2-second | scheme | doubleEverySecondElement | Practical 2 Task 3 | position-based
#### spec
Write `doubleEverySecondElement`, applied to a simple list of integers. Yield a list containing **only the doubles of every second value** (2nd, 4th, …).

- `'()` → `()`
- `'(4 6)` → `(12)`
- `'(4 6 2 3)` → `(12 6)`
#### hint
Position-based questions: look at **two** elements at a time. If there are fewer than two elements left, you're done. Otherwise double the second one and recurse on `(cdr (cdr lis))` (skip both).
#### solution
```scheme
(define (doubleEverySecondElement lis)
  (cond
    ((null? lis) '())
    ((null? (cdr lis)) '())
    (else
     (cons (* 2 (car (cdr lis)))
           (doubleEverySecondElement (cdr (cdr lis)))))))
```
#### explanation
Skipping two elements per call keeps the "odd/even position" in step without needing a counter. The same trick (check `(null? (cdr lis))`) is what you need for any question that looks at pairs.
#### tests
(doubleEverySecondElement '()) ==> ()
(doubleEverySecondElement '(4)) ==> ()
(doubleEverySecondElement '(4 6)) ==> (12)
(doubleEverySecondElement '(4 6 2 3)) ==> (12 6)
(doubleEverySecondElement '(1 2 3 4 5)) ==> (4 8)

### s-2026-st1-arith | scheme | sphereVolume | 2026 Semester Test 1 | let + formula
#### spec
Write `sphereVolume`, applied to the radius r. Yield V = 4/3 · π · r³. Yield **0 if r is negative or greater than 10**. Use a single `let` to bind `piValue` to the result of dividing 22 by 7 and `fourThirds` to 4 divided by 3 (use the division function — `22/7` written as a literal is a fraction, not a division).

- `(sphereVolume 5.6)` → approximately `735.9146666666666`
#### hint
`(let ((name1 expr1) (name2 expr2)) body)` — the body uses the names. Put the range check in an `if` (or `cond`) using `or`.
#### solution
```scheme
(define (sphereVolume r)
  (let ((piValue (/ 22 7))
        (fourThirds (/ 4 3)))
    (if (or (negative? r) (> r 10))
        0
        (* fourThirds piValue r r r))))
```
#### explanation
`let` evaluates both expressions first, then evaluates the body with the names bound. You can't use `let*` (not allowed) and you can't refer to `piValue` inside another binding of the same `let`. r³ is just `(* r r r)` — `*` takes any number of parameters.
#### tests
(sphereVolume 5.6) ==> 735.9146666666666
(sphereVolume -1) ==> 0
(sphereVolume 11) ==> 0
#### attempt 5 / 5
```scheme
(define (sphereVolume r)
   (let ((fourThirds (/ 4 3)) (piValue (/ 22 7)))
     (if (or (negative? r) (> r 10))
         0
         (* fourThirds piValue r r r))))
```
Full marks — this is exactly the expected structure. Use it as your template for any "formula + let" question.

### s-2025-st1-arith | scheme | coneArea | 2025 Semester Test 1 | let + formula
#### spec
Write `coneArea`, applied to radius r and slant height s. Yield A = π·r² + π·r·s. Yield 0 if either value is negative. Use one `let` to bind `pi` to 22 divided by 7 and `rSquared` to r × r.

- `(coneArea 1.2 2.1)` → approximately `12.445714285714285`
#### hint
Both bindings only use the parameters, so one ordinary `let` is enough.
#### solution
```scheme
(define (coneArea r s)
  (let ((pi (/ 22 7))
        (rSquared (* r r)))
    (if (or (negative? r) (negative? s))
        0
        (+ (* pi rSquared) (* pi r s)))))
```
#### explanation
Same template as `sphereVolume`. Note you can bind a name to *any* expression, including `(* r r)`.
#### tests
(coneArea 1.2 2.1) ==> 12.445714285714285
(coneArea -1 2) ==> 0

### s-2024-st1-arith | scheme | coneVolume | 2024 Semester Test 1 | let + formula
#### spec
Write `coneVolume`, applied to radius r and height h. Yield V = ⅓ · π · r² · h, or 0 if either value is negative. Use a `let` to bind `third` to 1 divided by 3 and `pi` to 22 divided by 7.

- `(coneVolume 2.8 1.7)` → approximately `13.962666666666665`
#### hint
Same template again. Multiply everything in one `*` application.
#### solution
```scheme
(define (coneVolume r h)
  (let ((third (/ 1 3))
        (pi (/ 22 7)))
    (if (or (negative? r) (negative? h))
        0
        (* third pi r r h))))
```
#### explanation
The answer has decimals because r and h are floats; exact fractions like 1/3 combine with floats to give a float.
#### tests
(coneVolume 2.8 1.7) ==> 13.962666666666665
(coneVolume 2.8 -1) ==> 0

### s-new-sum-evens | scheme | sumEvenNegateOdd | New practice | sum
#### spec
Write `sumEvenNegateOdd`, applied to a simple list of integers. Yield the sum where **even values are added** and **odd values are subtracted**.

- `'()` → `0`
- `'(2 3 4)` → `3` (2 − 3 + 4)
- `'(1 1 -2)` → `-4` (−1 − 1 + −2)
#### hint
Summing pattern. Subtracting is the same as adding the negation: `(- (recurse) x)` or `(+ (- x) (recurse))`.
#### solution
```scheme
(define (sumEvenNegateOdd lis)
  (cond
    ((null? lis) 0)
    ((even? (car lis)) (+ (car lis) (sumEvenNegateOdd (cdr lis))))
    (else (- (sumEvenNegateOdd (cdr lis)) (car lis)))))
```
#### explanation
Practise reading the spec literally: "odd values are subtracted" means subtract the value itself (so −3 subtracted adds 3).
#### tests
(sumEvenNegateOdd '()) ==> 0
(sumEvenNegateOdd '(2 3 4)) ==> 3
(sumEvenNegateOdd '(1 1 -2)) ==> -4

### s-new-strict-dec | scheme | strictlyDecreasing | New practice | compare neighbours
#### spec
Write `strictlyDecreasing`, applied to a simple numeric list. Yield `#t` if every value is **strictly less** than the one before it. Lists with fewer than two values yield `#t`.

- `'(9 5 2)` → `#t`
- `'(9 9 2)` → `#f`
#### hint
Copy the `monotonicallyIncreasing` skeleton and change only the failure test: the pair is bad when the first is `<=` the second.
#### solution
```scheme
(define (strictlyDecreasing lis)
  (cond
    ((null? lis) #t)
    ((null? (cdr lis)) #t)
    ((<= (car lis) (car (cdr lis))) #f)
    (else (strictlyDecreasing (cdr lis)))))
```
#### explanation
Compare-neighbour questions only differ in the failure condition. Always write both base cases.
#### tests
(strictlyDecreasing '()) ==> #t
(strictlyDecreasing '(4)) ==> #t
(strictlyDecreasing '(9 5 2)) ==> #t
(strictlyDecreasing '(9 9 2)) ==> #f
(strictlyDecreasing '(1 3)) ==> #f

### s-new-zeros-dup | scheme | removePositivesIncNegDupZeros | New practice (Scheme version of 2026 Prolog Q) | filter + map
#### spec
Write `removePositivesIncNegDupZeros`, applied to a simple list of integers. Yield the values in order with **positives removed**, **negatives incremented by 1**, and **zeros duplicated**.

- `'(4 0 -2)` → `(0 0 -1)`
#### hint
Three non-empty cases. Duplicating = two `cons`; removing = no `cons`; incrementing = `(+ x 1)`.
#### solution
```scheme
(define (removePositivesIncNegDupZeros lis)
  (cond
    ((null? lis) '())
    ((positive? (car lis)) (removePositivesIncNegDupZeros (cdr lis)))
    ((zero? (car lis))
     (cons 0 (cons 0 (removePositivesIncNegDupZeros (cdr lis)))))
    (else
     (cons (+ (car lis) 1) (removePositivesIncNegDupZeros (cdr lis))))))
```
#### explanation
Doing the same spec in both languages is the fastest way to see that the Prolog version is just this `cond` split into separate rules.
#### tests
(removePositivesIncNegDupZeros '()) ==> ()
(removePositivesIncNegDupZeros '(4 0 -2)) ==> (0 0 -1)
(removePositivesIncNegDupZeros '(0 7 -1)) ==> (0 0 0)

### s-new-max | scheme | maxValue | New practice | accumulate
#### spec
Write `maxValue`, applied to a **non-empty** simple numeric list. Yield the largest value (you may use `max`, which is allowed).

- `'(3 9 2)` → `9`
- `'(-5)` → `-5`
#### hint
Base case is the one-element list (the empty list has no maximum). Otherwise `(max (car lis) (maxValue (cdr lis)))`.
#### solution
```scheme
(define (maxValue lis)
  (cond
    ((null? (cdr lis)) (car lis))
    (else (max (car lis) (maxValue (cdr lis))))))
```
#### explanation
Some questions need a 1-element base case instead of the empty list. Read the assumptions in the spec.
#### tests
(maxValue '(3 9 2)) ==> 9
(maxValue '(-5)) ==> -5
(maxValue '(-5 -2 -9)) ==> -2

### s-new-member | scheme | countOccurrences | New practice (based on slide member) | count
#### spec
Write `countOccurrences`, applied to an atom and a simple list. Yield how many times the atom occurs in the list.

- `(countOccurrences 'a '(a b a c))` → `2`
#### hint
Start from the slides' `member` function, but instead of returning `#t` at the first match, add 1 and keep going.
#### solution
```scheme
(define (countOccurrences atm lis)
  (cond
    ((null? lis) 0)
    ((eqv? atm (car lis)) (+ 1 (countOccurrences atm (cdr lis))))
    (else (countOccurrences atm (cdr lis)))))
```
#### explanation
Know the four slide functions (`member`, `equalsimp`, `equal`, `append`) by heart — exam questions are always "no more complex than" these.
#### tests
(countOccurrences 'a '(a b a c)) ==> 2
(countOccurrences 'z '()) ==> 0
