import { DestroyRef, inject } from '@angular/core';
import { isObservable, of, retry, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export function createEffect(generator) {
    const destroyRef = inject(DestroyRef);
    const origin$ = new Subject();
    generator(origin$).pipe(
        retry(),
        takeUntilDestroyed(destroyRef)
    ).subscribe();

    return ((observableOrValue) => {
        const observable$ = isObservable(observableOrValue)
            ? observableOrValue.pipe(retry())
            : of(observableOrValue);
        return observable$.pipe(takeUntilDestroyed(destroyRef)).subscribe((value) => {
            origin$.next(value);
        });
    });
}
