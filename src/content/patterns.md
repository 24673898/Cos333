Every implementation question since 2022 is one of these shapes. Learn the skeleton, then only the tests change.

<!-- diagram:recipe -->

### 1 · Filter (keep some, drop others)
```scheme
(define (keepPositives lis)
  (cond
    ((null? lis) '())
    ((positive? (car lis)) (cons (car lis) (keepPositives (cdr lis))))   ; keep
    (else (keepPositives (cdr lis)))))                                     ; drop
```
```prolog
keepPositives([], []).
keepPositives([H|T], [H|R]) :- H > 0,  keepPositives(T, R).   % keep
keepPositives([H|T], R)     :- H =< 0, keepPositives(T, R).   % drop
```

### 2 · Map (change every element)
```scheme
(define (doubleAll lis)
  (cond
    ((null? lis) '())
    (else (cons (* 2 (car lis)) (doubleAll (cdr lis))))))
```
```prolog
doubleAll([], []).
doubleAll([H|T], [D|R]) :- D is H * 2, doubleAll(T, R).
```

### 3 · Filter + map (one rule per kind of value) — the most common exam shape
```scheme
(define (f lis)
  (cond
    ((null? lis) '())
    ((zero? (car lis)) (f (cdr lis)))                                   ; omit
    ((positive? (car lis)) (cons (* 2 (car lis)) (f (cdr lis))))        ; change
    (else (cons (car lis) (f (cdr lis))))))                              ; keep
```
```prolog
f([], []).
f([H|T], R)       :- H = 0, f(T, R).                     % omit
f([H|T], [D|R])   :- H > 0, D is H * 2, f(T, R).         % change
f([H|T], [H|R])   :- H < 0, f(T, R).                     % keep
```
Duplicate a value: Scheme `(cons x (cons x (f (cdr lis))))`, Prolog head `[H, H|R]`.

### 4 · Count
```scheme
(define (countNeg lis)
  (cond
    ((null? lis) 0)
    ((negative? (car lis)) (+ 1 (countNeg (cdr lis))))
    (else (countNeg (cdr lis)))))
```
```prolog
countNeg([], 0).
countNeg([H|T], C) :- H < 0,  countNeg(T, C1), C is C1 + 1.   % recurse FIRST, then is
countNeg([H|T], C) :- H >= 0, countNeg(T, C).
```

### 5 · Sum
```scheme
(define (sumPos lis)
  (cond
    ((null? lis) 0)
    ((positive? (car lis)) (+ (car lis) (sumPos (cdr lis))))
    (else (sumPos (cdr lis)))))
```
```prolog
sumPos([], 0).
sumPos([H|T], S) :- H > 0,  sumPos(T, S1), S is S1 + H.
sumPos([H|T], S) :- H =< 0, sumPos(T, S).
```

### 6 · Compare neighbours (two at a time)
```scheme
(define (increasing lis)
  (cond
    ((null? lis) #t)
    ((null? (cdr lis)) #t)                                 ; don't forget!
    ((> (car lis) (car (cdr lis))) #f)
    (else (increasing (cdr lis)))))
```
```prolog
increasing([]).
increasing([_]).
increasing([X, Y|T]) :- X =< Y, increasing([Y|T]).
```

### 7 · With an extra parameter (match an atom / a threshold)
```scheme
(define (countMatching lis atm)
  (cond
    ((null? lis) 0)
    ((eqv? (car lis) atm) (+ 1 (countMatching (cdr lis) atm)))
    (else (countMatching (cdr lis) atm))))
```
```prolog
countMatching([], _, 0).
countMatching([E|T], E, C) :- countMatching(T, E, C1), C is C1 + 1.
countMatching([H|T], E, C) :- not(H = E), countMatching(T, E, C).
```

### 8 · Formula with let (Semester Test 1 every year)
```scheme
(define (sphereVolume r)
  (let ((piValue (/ 22 7))
        (fourThirds (/ 4 3)))
    (if (or (negative? r) (> r 10))
        0
        (* fourThirds piValue r r r))))
```

### 9 · Facts and rules (Semester Test 2 every year)
```prolog
parent(X, Y) :- father(X, Y).                     % OR = two rules
parent(X, Y) :- mother(X, Y).
sibling(X, Y) :- parent(P, X), parent(P, Y), not(X = Y).
grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
uncleAunt(X, Y)   :- parent(P, Y), sibling(X, P).
nephewNiece(X, Y) :- parent(P, X), sibling(P, Y).
cousin(X, Y)      :- parent(PX, X), parent(PY, Y), sibling(PX, PY).
livesWith(X, Y)   :- married(X, Y).               % symmetric relation
livesWith(X, Y)   :- married(Y, X).
```

### Final checklist before you submit
- **Scheme:** `#lang racket` at the top · every call is `(f x)` · only allowed functions (`positive?` may be missing — use `(> x 0)`) · test `'()`, a one-element list, and lists that hit every `cond` clause.
- **Prolog:** base case first · one guard per rule so each value fits exactly one rule · variables are Uppercase · `is` for arithmetic, `=<` not `<=` · no `;`, `->`, built-in `member/append/reverse/abs` · test with a variable and press `;` until `false` — no wrong answers may appear.
