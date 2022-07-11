export const formP = () => {
    return (<form
        action="/sent_description" method="post" id="signup">
        <div className="form-group p-5">
            <label htmlFor="txaDescripcion">Descripcion de la tarea</label>
            <textarea className="form-control" id="txaDescripcion" ></textarea>
            <button type="submit" className="mt-3 btn btn-primary">Submit</button>
        </div>
    </form>)
}