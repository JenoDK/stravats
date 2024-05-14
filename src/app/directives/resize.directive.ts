import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
	selector: '[resize]'
})
export class ResizeDirective implements OnInit, OnDestroy {
	@Output() resized = new EventEmitter<HTMLElement>();

	ro: ResizeObserver;

	constructor(private el: ElementRef) {
	}

	ngOnInit() {
		const target = this.el.nativeElement;
		this.ro = new ResizeObserver(() => this.resized.emit(target));
		this.ro.observe(target);
	}

	ngOnDestroy() {
		const target = this.el.nativeElement;
		this.ro.unobserve(target);
	}

}
