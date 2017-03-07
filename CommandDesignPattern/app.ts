///<reference path="Scripts/typings/snapsvg/snapsvg.d.ts" />

module Command {

    interface ICommand {
        execute(): void;
        undo(): void;
    }

    class Invoker {
        private commands = new Array();
        private current = -1;

        constructor() {
        }

        ExecuteCommand(command: ICommand) {
            if (this.commands.length - 1 > this.current) {
                var next = this.current + 1
                this.commands.splice(next, this.commands.length - next);
            }

            this.commands.push(command);
            command.execute();
            this.current = this.commands.length - 1;
        }

        public undo() {
            if (this.current >= 0) {
                this.commands[this.current--].undo();
            }
        }

        public redo() {
            if (this.current < this.commands.length - 1) {
                this.commands[++this.current].execute();
            }
        }
    }

    class MoveCommand implements ICommand {
        constructor(private object: Snap.Element,
                    private origTransform: any,
                    private dx: number,
                    private dy: number) {
        }

        public execute() {
            this.object.attr({
                transform: this.origTransform + (this.origTransform ? "T" : "t") + [this.dx, this.dy]
            });
        }

        public undo() {
        }
    }

    window.onload = () => {

        let s = Snap('svg');
        let invoker = new Invoker();

        let rect = s.rect(20, 20, 40, 40);
        let circle = s.circle(60, 150, 50);

        let move = function (dx, dy) {
            invoker.ExecuteCommand(new MoveCommand(this, this.data('origTransform'), dx, dy));
        }

        let start = function () {
            this.data('origTransform', this.transform().local);
        }
        let stop = function () {
            console.log('finished dragging');
        }

        rect.drag(move, start, stop);
        circle.drag(move, start, stop);
    };
}