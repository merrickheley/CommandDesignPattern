///<reference path="Scripts/typings/snapsvg/snapsvg.d.ts" />

// Lazy global variable. This is bad practice.
var invoker: Command.Invoker;

module Command {

    interface ICommand {
        execute(): void;
        undo(): void;
    }

    export class Invoker {
        private commands = new Array();
        private current = -1;

        constructor() {
        }

        StoreCommand(command: ICommand) {
            if (this.commands.length - 1 > this.current) {
                var next = this.current + 1
                this.commands.splice(next, this.commands.length - next);
            }

            this.commands.push(command);
            this.current = this.commands.length - 1;
        }

        ExecuteCommand(command: ICommand) {
            this.StoreCommand(command);
            command.execute();
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
            this.object.attr({
                transform: this.origTransform + (this.origTransform ? "T" : "t")
            });  
        }
    }

    window.onload = () => {

        let s = Snap('svg');
        invoker = new Invoker();

        let rect = s.rect(20, 20, 40, 40);
        let circle = s.circle(60, 150, 50);

        let tempdx: number;
        let tempdy: number;

        let move = function (dx, dy) {
            tempdx = dx;
            tempdy = dy;
            this.attr({
                transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
            });
        }

        let start = function () {
            this.data('origTransform', this.transform().local);
        }

        let stop = function () {
            invoker.StoreCommand(new MoveCommand(this, this.data('origTransform'), tempdx, tempdy));
        }

        rect.drag(move, start, stop);
        circle.drag(move, start, stop);
    };
}