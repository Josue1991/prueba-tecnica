/**
 * Entidad de dominio: ProductoFinanciero
 * Representa un producto financiero en el dominio del negocio
 */
export class ProductoFinanciero {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly logo: string,
        public readonly dateRelease: Date,
        public readonly dateRevision: Date
    ) {
        this.validate();
    }

    /**
     * Valida que los datos del producto sean correctos
     */
    private validate(): void {
        if (!this.id || this.id.trim() === '') {
            throw new Error('El ID del producto es obligatorio');
        }
        
        if (!this.name || this.name.trim() === '') {
            throw new Error('El nombre del producto es obligatorio');
        }
        
        if (!this.description || this.description.trim() === '') {
            throw new Error('La descripción del producto es obligatoria');
        }
        
        if (!this.logo || this.logo.trim() === '') {
            throw new Error('El logo del producto es obligatorio');
        }
        
        if (!(this.dateRelease instanceof Date) || Number.isNaN(this.dateRelease.getTime())) {
            throw new TypeError('La fecha de liberación debe ser una fecha válida');
        }
        
        if (!(this.dateRevision instanceof Date) || Number.isNaN(this.dateRevision.getTime())) {
            throw new TypeError('La fecha de revisión debe ser una fecha válida');
        }
    }

    /**
     * Crea una instancia desde datos planos (DTO)
     */
    static fromPlainObject(data: any): ProductoFinanciero {
        return new ProductoFinanciero(
            data.id,
            data.name,
            data.description,
            data.logo,
            new Date(data.date_release || data.dateRelease),
            new Date(data.date_revision || data.dateRevision)
        );
    }

    /**
     * Convierte la entidad a un objeto plano
     */
    toPlainObject(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            logo: this.logo,
            date_release: this.dateRelease.toISOString(),
            date_revision: this.dateRevision.toISOString()
        };
    }
}
