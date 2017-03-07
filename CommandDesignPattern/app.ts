///<reference path="Scripts/typings/snapsvg/snapsvg.d.ts" />

window.onload = () => {

    let s = Snap('svg');

    let rect = s.rect(20, 20, 40, 40);
    let circle = s.circle(60, 150, 50);

    let move = function (dx, dy) {
        this.attr({
            transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
        });
    }

    let start = function () {
        this.data('origTransform', this.transform().local);
    }
    let stop = function () {
        console.log('finished dragging');
    }

    rect.drag(move, start, stop);
    circle.drag(move, start, stop);;
};