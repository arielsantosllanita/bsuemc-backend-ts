import { Form } from '@/interfaces/form.interface';
import formModel from '@/models/form.model';

class FormService {
  public async add_form(formPath: any, type: string): Promise<Form> {
    const docs = [];
    formPath.forEach(v => {
      const path = { fileName: v.originalname, filePath: v.path, fileType: v.mimetype };
      docs.push(path);
    });

    const form = await formModel.create({ type, docs });

    return form;
  }

  public async update_form(formID: string, updateObj: any): Promise<Form> {
    const docs = [];
    updateObj.forEach(v => {
      const path = { fileName: v.originalname, filePath: v.path, fileType: v.mimetype };
      docs.push(path);
    });

    const form = await formModel.findByIdAndUpdate(formID, { $set: { docs } }, { new: true });

    return form;
  }

  public async remove_form(formID: string): Promise<Form> {
    const form = await formModel.findByIdAndRemove(formID);

    return form;
  }

  public async show_all_form(): Promise<Form[]> {
    const forms = await formModel.find({});

    return forms;
  }

  public async show_form_by_type(formType: string): Promise<Form> {
    const forms = await formModel.findOne({ type: formType });

    return forms;
  }
}

export default FormService;
